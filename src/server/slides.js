import { createLeftImageSlide, createRightImageSlide, createTitleSlide, createTitleSubTextSlide } from "./slide";

const getSlides = () => SlidesApp.getActivePresentation().getSlides();

export const setActiveSlide = (slideIndex) => {
  const slides = SlidesApp.getActivePresentation().getSlides()[slideIndex].selectAsCurrentPage();
}

const getActiveSlideIndex = () => {
  const activePage = SlidesApp.getActivePresentation()
    .getSelection()
    .getCurrentPage();
  const slides = getSlides();
  return slides.findIndex(
    (slide) => slide.getObjectId() === activePage.getObjectId(),
  );
};

export const getSlidesData = () => {
  const activeSlideIndex = getActiveSlideIndex();
  return getSlides().map((slide, index) => {
    const id = slide.getObjectId();
    return {
      id,
      index,
      isActive: index === activeSlideIndex,
    };
  });
};

export const addSlide = () => {
  const presentation = SlidesApp.getActivePresentation();
  presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  return getSlidesData();
};

export const deleteSlide = (slideIndex) => {
  const slides = getSlides();
  const slideToDelete = slides[slideIndex];
  slideToDelete.remove();
  return getSlidesData();
};

export const generatePresentation = async (outlineContent, themeId) => {
  console.log('Generating presentation...');
  try {
    const response = UrlFetchApp.fetch("https://possible-crack-thrush.ngrok-free.app/api/v1/ai-presentation/content", {
      method: "post",
      payload: JSON.stringify({
        outline: outlineContent
      }),
      contentType: "application/json",
      muteHttpExceptions: true
    });
    
    // Parse the response and then parse the presentation string
    const jsonResponse = JSON.parse(response.getContentText());
    const presentationData = JSON.parse(jsonResponse.presentation);
    
    console.log('Parsed presentation data:', presentationData);
    
    const sourceDeck = SlidesApp.openById(themeId);
    const targetPresentation = SlidesApp.getActivePresentation();
    let slides = [];
    const slideTemplate = copyAllSlidesTemplate(themeId);

    // Now iterate through the slides array from presentationData
    for (let slide of presentationData.slides) {
      if(slide.type_id === 'title' ){
        let masterSlide = slideTemplate[0];
        let duplicatedSlide = masterSlide.duplicate();
        let newSlide = await createTitleSlide(duplicatedSlide, slide.inputs);
        slides.push(newSlide);
      } else if (slide.type_id === "left-image-text"){
        let masterSlide = slideTemplate[1];
        let duplicatedSlide = masterSlide.duplicate();
        let newSlide = await createLeftImageSlide(duplicatedSlide, slide.inputs);
        slides.push(newSlide);
      } else if (slide.type_id === "right-image-text"){
        let masterSlide = slideTemplate[2];
        let duplicatedSlide = masterSlide.duplicate();
        let newSlide = await createRightImageSlide(duplicatedSlide, slide.inputs);
        slides.push(newSlide);
      } else {
        let masterSlide = slideTemplate[3];
        let duplicatedSlide = masterSlide.duplicate();
        let newSlide = await createTitleSubTextSlide(duplicatedSlide, slide.inputs);
        slides.push(newSlide);
      }
    }

    await Promise.all(slides.map(async (sourceSlide) => {
     targetPresentation.appendSlide(sourceSlide);
    }),

    targetPresentation.appendSlide(slideTemplate[4]),
    deleteDuplicateSourceTheme(slides)
  );


    
    return {
      success: true,
      presentationId: targetPresentation.getId()
    };

  } catch (error) {
    console.error('Error generating presentation:', error);
    throw new Error(`Failed to generate presentation: ${error.toString()}`);
  }
}

export const copyAllSlidesTemplate = (presentationId) => {
  const sourceDeck = SlidesApp.openById(presentationId);
  const targetPresentation = SlidesApp.create("Presentation Copy");
  const slides = sourceDeck.getSlides();
  
  return slides;
}

const getAllTextFromTargetSlide = (slide) => {
  const pageElements = slide.getPageElements();
  let collectedText = [];
  collectedText.push("This is the content of this slide:");

  pageElements.forEach(function (element) {
    if(element.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
      const shape = element.asShape();
      const textRange = shape.getText();
      if (textRange) {
        const text = textRange.asString().trim();
        if (text !== "") {
          collectedText.push(text);
        }
      }
    }
  });

  const speakerNotesShape = slide.getNotesPage().getSpeakerNotesShape();
  if(speakerNotesShape) {
    const notesText = speakerNotesShape.getText().asString();
    if(notesText.trim() !== "") {
      collectedText.push("\nSpeaker Notes:\n" + notesText);
    }
  }

  const allText = collectedText.join("\n");
  return allText;
}

export const getAllTextFromPresentation = () => {
  const slides = SlidesApp.getActivePresentation().getSlides();
  let collectedText = [];
  
  for(let i = 0; i < slides.length; i++) {
    collectedText.push(`\n=== Content of Slide ${i + 1} ===\n`);
    collectedText.push(getAllTextFromTargetSlide(slides[i]));
  }
  
  const presentationContent = collectedText.join("\n");
  return presentationContent;
}

export const deleteDuplicateSourceTheme = (slides) => {
  while(slides.length > 0){
    slides.pop().remove();
  }
}

function deleteDuplicateSourceThemeById(slide){
  slide.remove();
}