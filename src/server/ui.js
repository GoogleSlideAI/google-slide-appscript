export const onOpen = () => {
  const menu = SlidesApp.getUi()
    .createMenu("Jarvis.cx - Create Slides with AI")
    .addItem("Generate new ppt", "openDialog")
    .addItem("Slide AI", "openSidebar");

  menu.addToUi();
};

export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile("dialog")
    .setWidth(1200)
    .setHeight(1200)
    .setSandboxMode(HtmlService.SandboxMode.NATIVE);
  SlidesApp.getUi().showModalDialog(html, "Jarvis Generate Presentation");
};

export const openSidebar = () => {
  // const html = HtmlService.createHtmlOutputFromFile("sidebar").setTitle("Jarvis AI Slide");
  SlidesApp.getUi().showSidebar(
    HtmlService.createHtmlOutputFromFile("sidebar").setTitle("Jarvis AI Slide"),
  );
};

// function showSidebar() {
//   const html = HtmlService.createHtmlOutputFromFile('dialog/index')
//     .setTitle('Presentation AI')
//     .setSandboxMode(HtmlService.SandboxMode.NATIVE);
    
//   SlidesApp.getUi().showSidebar(html);
// }

// function showDialog() {
//   const html = HtmlService.createHtmlOutputFromFile('dialog/index')
//     .setTitle('Presentation AI')
//     .setSandboxMode(HtmlService.SandboxMode.NATIVE);
    
//   SlidesApp.getUi().showModalDialog(html, 'Presentation AI');
// }
