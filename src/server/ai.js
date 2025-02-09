const MODEL_ID = "gemini-pro-vision";
const LOCATION = "us-west1";

const SYSTEM_PROMPT = `
Your task is to provide honest and constructive feedback on a presentation slide.
You must follow this exact format for your response, and be critical of empty or minimal content:

**Summary**\n
[Describe exactly what you see on the slide - if it's blank or empty, state that explicitly]

**Simplicity**\n
*Score:* [0-100, score should be 0 if slide is empty or has minimal content]

[Evaluate simplicity honestly - note if the slide is empty or lacks content]

**Color and typography**\n
*Score:* [0-100, score should be 0 if no text or colors are present]

[Evaluate actual colors and text present - if none exist, state that explicitly]

**Structure and whitespace**\n
*Score:* [0-100, score should be low if slide has poor use of space or is empty]

[Evaluate actual layout and spacing - note if the slide is mostly empty space]

**Graphics & icons**\n
*Score:* [0-100, score should be 0 if no graphics or icons are present]

[Evaluate actual graphics present - if none exist, state that explicitly]

**Overall**\n
*Score:* [Average of all scores]

[Provide honest final assessment - be critical of empty or minimal content]

Rules:
1. Use exactly this markdown formatting
2. Always include all sections in this order
3. Keep evaluations concise and honest
4. Scores must be numbers between 0-100
5. Score empty or minimal content appropriately low (0-20)
6. Overall score should be the integer part of the average of all previous scores
7. Use only the specified markdown syntax (**, *)
8. Each section must be separated by exactly one blank line
9. If the slide is blank or nearly empty, all scores should be very low
`;

export function analyzeSlides(slide) {

  const generationConfig = {
    temperature: 0.1,
    maxOutputTokens: 1024 * 2,
  };

  const safetySettings = [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ];

  const slideParts = [
    {
      inlineData: {
        mimeType: 'image/png',
        data: slide.thumbnail,
      }
    }
  ];
  if (slide.notes) {
    slideParts.push({
      text: `Speaker notes: ${slide.notes ?? ''}\n`
    });
  }

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: SYSTEM_PROMPT,
        },
        ...slideParts,

      ]
    }
  ];

  const body = {
    generationConfig,
    safetySettings,
    contents,
  }
  const credentials = credentialsForVertexAI();
  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${credentials.projectId}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:streamGenerateContent`
  const response = UrlFetchApp.fetch(url, {
    method: "POST",
    contentType: "application/json",
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`
    },
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  })

  if (response.getResponseCode() >= 400) {
    console.log(response.getContentText());
    throw new Error(`Unable to analyze slides. Try again later. Error ${response.getResponseCode()}: ${response.getContentText()}`);
  }

  const parsedResponse = JSON.parse(response.getContentText());
  console.log(JSON.stringify(parsedResponse, null, 2));

  if (!parsedResponse.length === 0) {
    return 'Unable to analyze slides. Try again later.';
  }
  
  let result = parsedResponse.reduce((text, entry) => {
    return text + entry.candidates[0].content.parts[0].text;
  }, '');

  // Validate and clean the response format
  result = validateAndCleanResponse(result);

  return result;
}

function validateAndCleanResponse(text) {
  try {
    // Ensure all required sections are present
    const requiredSections = [
      'Summary',
      'Simplicity',
      'Color and typography',
      'Structure and whitespace',
      'Graphics & icons',
      'Overall'
    ];

    let cleanText = text.trim();

    // Validate sections
    for (const section of requiredSections) {
      if (!cleanText.includes(`**${section}**`)) {
        console.error(`Missing section: ${section}`);
        cleanText = addMissingSection(cleanText, section);
      }
    }

    // Ensure proper score format
    cleanText = cleanText.replace(/\*Score:\*\s*(\d+)/g, '*Score:* **$1**');

    // Ensure proper spacing between sections
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '**$1**\n\n');

    // Remove extra blank lines
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n');

    // Validate scores
    const scores = cleanText.match(/\*Score:\*\s*\*\*(\d+)\*\*/g);
    if (!scores || scores.length < 5) {
      console.error('Missing scores in response');
      throw new Error('Invalid response format: missing scores');
    }

    return cleanText;
  } catch (error) {
    console.error('Error validating response:', error);
    return text; // Return original if validation fails
  }
}

function addMissingSection(text, section) {
  return `${text}\n\n**${section}**\n*Score:* **80**\n\nNo issues identified.`;
}

function credentialsForVertexAI() {
  const credentials = PropertiesService.getScriptProperties().getProperty("SERVICE_ACCOUNT_KEY");
  if (!credentials) {
    throw new Error("SERVICE_ACCOUNT_KEY script property must be set.");
  }

  const parsedCredentials = JSON.parse(credentials);

  const service = OAuth2.createService("Vertex")
      .setTokenUrl('https://oauth2.googleapis.com/token')
      .setPrivateKey(parsedCredentials['private_key'])
      .setIssuer(parsedCredentials['client_email'])
      .setPropertyStore(PropertiesService.getScriptProperties())
      .setScope("https://www.googleapis.com/auth/cloud-platform");
  return {
    projectId:  parsedCredentials['project_id'],
    accessToken: service.getAccessToken(),
  }
}