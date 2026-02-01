import NavbarV01 from "./Navbar_V01";
import Navbar_V02 from "./nav-bar-v02/Navbar_V02";

const NavbarMainContainer = () => {
  const pageVersion = import.meta.env.VITE_WEB_VERSION ?? "V_01";

  const renderHomePages = () => {
    switch (pageVersion) {
      case "V_01":
        return <NavbarV01 />;
      case "V_02":
        return <Navbar_V02 />;
      default:
        return <NavbarV01 />;
    }
  };
  return <div>{renderHomePages()}</div>;
};

export default NavbarMainContainer;
