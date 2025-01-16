const MODEL_ID = "gemini-pro-vision";
const LOCATION = "us-west1";

const SYSTEM_PROMPT = `
Your task is to provide constructive feedback on a presentation.
You must follow this exact format for your response:

**Summary**\n
[State the summary of the slide in one sentence]

**Simplicity**\n
*Score:* [0-100]

[Evaluation of simplicity in 1-2 sentences]

**Color and typography**\n
*Score:* [0-100]

[Evaluation of colors and typography in 1-2 sentences]

**Structure and whitespace**\n
*Score:* [0-100]

[Evaluation of structure and whitespace in 1-2 sentences]

**Graphics & icons**\n
*Score:* [0-100]

[Evaluation of graphics and icons in 1-2 sentences]

**Overall**\n
*Score:* [Average of all scores]

[Final summary in 1-2 sentences]

Rules:
1. Use exactly this markdown formatting
2. Always include all sections in this order
3. Keep evaluations concise
4. Scores must be numbers between 0-100
5. Do not suggest improvements if the score is 90 or above
6. Overall score should be the integer part of the average of all previous scores
7. Use only the specified markdown syntax (**, *)
8. Each section must be separated by exactly one blank line
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