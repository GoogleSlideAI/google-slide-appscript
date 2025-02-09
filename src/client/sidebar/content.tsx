import { useMemo, useState } from "react";
import SidebarHeader from "./components/sidebar-header";
import { DEFAULT_SCREEN, NAV_SCREENS } from "./constants";

const Content = () => {
  const [screen, setScreen] = useState<string>(DEFAULT_SCREEN);

  const selectedScreen = useMemo(() => {
    const screenObject = NAV_SCREENS.find((item) => item.key === screen);
    return screenObject;
  }, [screen]);

  const { content } = selectedScreen || {};
  return (
    <div className="h-full">
      <SidebarHeader value={screen} onValueChange={setScreen} />
      <div className="h-full overflow-x-hidden">{content}</div>
    </div>
  );
};

export default Content;
