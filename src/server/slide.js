import { analyzeSlides, generateSlideScript } from "./ai";

const getActiveSlideIndex = () => {
  const activePage = SlidesApp.getActivePresentation()
    .getSelection()
    .getCurrentPage();
  const slides = SlidesApp.getActivePresentation().getSlides();

  return slides.findIndex(
    (slide) => slide.getObjectId() === activePage.getObjectId(),
  );
};

export const createSlide = async (presentationId, slideId, slideContent) => {
  let targetPresentation = SlidesApp.getActivePresentation();
  let copyTemplateSlide = copySlideTemplate(presentationId, slideId);
  let newSlide;
  const slideContentValue = JSON.parse(slideContent);
  if(slideContentValue.type_id === 'title' ){
    newSlide = await createTitleSlide(copyTemplateSlide, slideContentValue.inputs);
  } else if (slideContentValue.type_id === "left-image-text"){
    newSlide = await createLeftImageSlide(copyTemplateSlide, slideContentValue.inputs);
  } else if (slideContentValue.type_id === "right-image-text"){
    newSlide = await createRightImageSlide(copyTemplateSlide, slideContentValue.inputs);
  } else {
    newSlide = await createTitleSubTextSlide(copyTemplateSlide, slideContentValue.inputs);
  }
  const position = getActiveSlideIndex();
  if(position === -1){
    targetPresentation.appendSlide(newSlide);
  } else {
    targetPresentation.insertSlide(position + 1, newSlide);
  }
  newSlide.remove();
  await activeSlide(position + 1);
  return {
    success: true,
    presentationId: targetPresentation.getId()
  };
 }

export const activeSlide = async(position) => {
  const slide = SlidesApp.getActivePresentation().getSlides()[position];
  const pageElement = slide.getPageElements()[0];
  // Only select this page element and remove any previous selection.
  pageElement.select();
}

export const createTitleSlide = (slide, slideContent) => {
  slide.replaceAllText("<<title>>", slideContent['title'])
  slide.replaceAllText("<<title-subtitle>>", slideContent['subtitle'])
  slide.getNotesPage().getSpeakerNotesShape().getText().setText(slideContent['speak-notes'])
  return slide;
}

export const createLeftImageSlide = async (slide, slideContent) => {
    slide.replaceAllText("<<left-image-text_title>>", slideContent['title'])
    slide.replaceAllText("<<left-image-text_body>>", slideContent['body'])
    slide.getNotesPage().getSpeakerNotesShape().getText().setText(slideContent['speak-notes'])
    await replaceTextShapeWithImage(slide, slideContent['image_prompt'])
    return slide
}

export const createRightImageSlide = async (slide, slideContent) => {
    slide.replaceAllText("<<right-image-text_title>>", slideContent['title'])
    slide.replaceAllText("<<right-image-text_body>>", slideContent['body'])
    slide.getNotesPage().getSpeakerNotesShape().getText().setText(slideContent['speak-notes'])
    await replaceTextShapeWithImage(slide, slideContent['image_prompt'])
    return slide
}

export const createTitleSubTextSlide = (slide, slideContent) => {
    slide.replaceAllText("<<title-sub-text_title>>", slideContent['title'])
    slide.replaceAllText("<<title-sub-text_sub>>", slideContent['subtitle'])
    slide.replaceAllText("<<title-sub-text_body>>", slideContent['body'])
    slide.getNotesPage().getSpeakerNotesShape().getText().setText(slideContent['speak-notes'])
    return slide
}

export const replaceTextShapeWithImage = async (slide, imagePrompt) => {
  try {  
    const response = UrlFetchApp.fetch("https://possible-crack-thrush.ngrok-free.app/api/v1/ai-slide/image", {
      method: "post",
      payload: JSON.stringify({ prompt: imagePrompt }),
      contentType: "application/json",
      muteHttpExceptions: true
    });
    
    const imageUrl = response.getContentText();

    slide.getShapes().forEach(shape => {
      if(shape.getText().asString().trim() === "<<left-image-text_image>>" || 
         shape.getText().asString().trim() === "<<right-image-text_image>>") {
        shape.replaceWithImage(imageUrl);
      }
    });
  } catch (error) {
    console.error('Error replacing image:', error);
    throw new Error(`Failed to replace image: ${error.toString()}`);
  }
}

export const copySlideTemplate = (presentationId, slideId) => {
  let sourceDeck = SlidesApp.openById(presentationId);
  let slide = sourceDeck.getSlideById(slideId);

  return slide.duplicate();
}

export const getAllTextFromActiveSlide = async () => {
  const presentation = SlidesApp.getActivePresentation();
  const selectedSlide = presentation.getSelection().getCurrentPage();
  if (!selectedSlide || selectedSlide.getPageType() !== SlidesApp.PageType.SLIDE) {
    Logger.log("No active slide found or the current page is not a slide.");
    return;
  }
  const slide = selectedSlide.asSlide();

  const pageElements = slide.getPageElements();
  let collectedText = [];
  collectedText.push("This is the content of this slide:\n");

  pageElements.forEach(function (element) {
    if(element.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
      const shape = element.asShape();
      const textRange = shape.getText();
      if (textRange) {
        collectedText.push(textRange.asString());
      }
    }
  });

  const speakerNotesShape = slide.getNotesPage().getSpeakerNotesShape();
  if(speakerNotesShape) {
    const notesText = speakerNotesShape.getText().asString();
    if(notesText.trim() !== "") {
      collectedText.push("Speaker Notes:\n" + notesText);
    }
  }

  const allText = collectedText.join("\n");
  return allText;
}

//evaluate SLIDE
const getPresentationId = () => {
  const presentation = SlidesApp.getActivePresentation();
  if (!presentation) {
    return null;
  }
  return presentation.getId();
}

const getSelectedPageId = () => {
  const presentation = SlidesApp.getActivePresentation();
  const selection = presentation.getSelection();
  if (!selection) {
    return null;
  }
  const currentPage = selection.getCurrentPage();

  if (!currentPage) {
    return null;
  }
  const pageId = currentPage.asSlide().getObjectId();
  return pageId
}

const fetchThumbnail = (presentationId, pageId) => {
  const metadata = Slides.Presentations.Pages.getThumbnail(presentationId, pageId, {
    "thumbnailProperties.mimeType": "PNG",
    "thumbnailProperties.thumbnailSize": "LARGE"
  });
  if (!metadata) {
    return null;
  }
  const url = metadata.contentUrl;
  if (!url) {
    return null;
  }
  const mediaResponse = UrlFetchApp.fetch(url);
  const thumbnail = mediaResponse.getBlob();
  return Utilities.base64Encode(thumbnail.getBytes());
}

const fetchSpeakerNotes = (presentationId, pageId) => {
  const page = Slides.Presentations.Pages.get(presentationId, pageId);
  if (!page || !page.notesProperties || !page.pageElements) {
    return null;
  }

  const objectId = page.notesProperties.speakerNotesObjectId;
  if (!objectId) {
    return null;
  }

  const notesObject = page.pageElements.find(p => p.objectId === objectId);
  if (!notesObject || !notesObject.shape) {
    return null;
  }

  return flattenText(notesObject.shape.text);
}

const flattenText = (text) => {
  if (!text) {
    return null;
  }
  text = text.textElements.reduce((text, span) => {
    if (!span.textRun || !span.textRun.content) {
      return text;
    }
    return text + span.textRun.content;
  }, '');
  return text;
}

export const evaluateSlide = async () => {
  const presentationId = getPresentationId();
  const pageId = getSelectedPageId();
  const thumbnail = fetchThumbnail(presentationId, pageId);
  const notes = fetchSpeakerNotes(presentationId, pageId);
  const analysis = analyzeSlides({
    thumbnail,
    notes,
  });
  return analysis;
}

export const generateSlideScriptContent = async () => {
  const presentationId = getPresentationId();
  const pageId = getSelectedPageId();
  const thumbnail = fetchThumbnail(presentationId, pageId);
  const notes = fetchSpeakerNotes(presentationId, pageId);
  const analysis = generateSlideScript({

    thumbnail,
    notes,
  });
  return analysis;
}

export const addTextToSlide = (inputText) => {
  try {
    // Get the active presentation and slide
    var presentation = SlidesApp.getActivePresentation();
    var slide = presentation.getSelection().getCurrentPage();
    

    // Create a text box with the input text
    var textBox = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 100, 100, 300, 100);
    textBox.getText().setText(inputText);
    
    // Style the text
    var textRange = textBox.getText();
    textRange.getTextStyle()
      .setFontSize(14)
      .setFontFamily('Arial')
      .setBold(false)
      .setForegroundColor('#000000'); // Set text color to black
    
    // Style the text box
    
    Logger.log('Text box added successfully');
    return textBox;
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return null;
  }
}

export const insertNotesToSlide = (position, notes) => {
  const presentation = SlidesApp.getActivePresentation();
  const slide = presentation.getSlides()[position];
  const speakerNotesShape = slide.getNotesPage().getSpeakerNotesShape();
  speakerNotesShape.getText().setText(notes);
}
