import CreateSlideScreen from "./components/create-slide-screen";
import EvaluateSlideScreen from "./components/evaluate-slide-screen";
import RemixSlideScreen from "./components/remix-slide-screen";

export enum NavScreen {
    CREATE = 'create',
    REMIX = "remix",
    EVALUATE = "evaluate"
}

export const NAV_SCREENS = [
    {
        key: NavScreen.CREATE,
        label: "Create slide",
        content: <CreateSlideScreen />,
        buttonText: "Generate Slide" 
    },
    {
        key: NavScreen.REMIX,
        label: "Remix slide",
        content: <RemixSlideScreen />,
        buttonText: "Remix Slide"
    },
    {
        key: NavScreen.EVALUATE,
        label: "Evaluate slide",
        content: <EvaluateSlideScreen />,
        buttonText: "Evaluate Slide"
    }
]

export const DEFAULT_SCREEN = NavScreen.CREATE;