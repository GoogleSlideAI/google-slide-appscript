import { onOpen, openDialog, openSidebar } from "./ui";

import { getSlidesData, addSlide, deleteSlide, generatePresentation, setActiveSlide, getAllTextFromPresentation } from "./slides";
import { createSlide, evaluateSlide, getAllTextFromActiveSlide, generateSlideScriptContent, addTextToSlide } from "./slide";
import { getUserInfo, getUserProfilePicture } from "./userinfo";
export {
  onOpen,
  openDialog,
  openSidebar,
  getSlidesData,
  addSlide,
  deleteSlide,
  createSlide,
  getAllTextFromActiveSlide,
  getAllTextFromPresentation,
  generatePresentation,
  setActiveSlide,
  evaluateSlide,
  generateSlideScriptContent,
  getUserInfo,
  getUserProfilePicture,
  addTextToSlide
};  