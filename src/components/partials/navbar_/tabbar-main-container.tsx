import { TabBar_V01 } from "./TabBar_V01";

const TabBarMainContainer = () => {
  const pageVersion = import.meta.env.VITE_WEB_VERSION ?? "V_01";

  const renderHomePages = () => {
    switch (pageVersion) {
      case "V_01":
        return (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2">
            <TabBar_V01 />
          </div>
        );
      case "V_02":
        // return <TabBar_V02 />;
        return null;

      default:
        return <TabBar_V01 />;
    }
  };
  return <div>{renderHomePages()}</div>;
};

export default TabBarMainContainer;
