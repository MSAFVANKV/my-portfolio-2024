import HomeV01 from "./Home-V01";
import HomeV02HomePage from "./Home_V02/home-v02-main";

const MainHomeContainer = () => {
  const pageVersion = import.meta.env.VITE_WEB_VERSION ?? "V_01";

  const renderHomePages = () => {
    switch (pageVersion) {
      case "V_01":
        return <HomeV01 />;
      case "V_02":
        return (
          <div className="h-screen pt-[150px]">
            <HomeV02HomePage />
          </div>
        );
      default:
        return <HomeV01 />;
    }
  };
  return <div>{renderHomePages()}</div>;
};

export default MainHomeContainer;
