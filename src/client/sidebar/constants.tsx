import ChatBotScreen from "./components/chat-bot-screen";
import CreateSlideScreen from "./components/create-slide-screen";
import OtherToolsScreen from "./components/other-tools-screen";
import RemixSlideScreen from "./components/remix-slide-screen";

export enum NavScreen {
    CREATE = 'create',
    REMIX = "remix",
    OTHER_TOOLS = "other-tools",
    CHAT_BOT = "chat-bot"
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
        key: NavScreen.CHAT_BOT,
        label: "Chat bot",
        content: <ChatBotScreen />,
        buttonText: "Chat Bot"
    },
    {
        key: NavScreen.OTHER_TOOLS,
        label: "Other tools",
        content: <OtherToolsScreen />,
        buttonText: "Other Tools"
    },
]


export const DEFAULT_SCREEN = NavScreen.CREATE;