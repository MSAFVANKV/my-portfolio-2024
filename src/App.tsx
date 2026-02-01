import { Outlet } from "react-router-dom";

import "./App.css";
import NavbarMainContainer from "./components/partials/navbar_/navbar-main";
import TabBarMainContainer from "./components/partials/navbar_/tabbar-main-container";
import { AuthProvider } from "./provider/context/AuthContext";

function App() {
  return (
    <>
      <div className="w-screen scrollbar-none">
        {/* NAVBAR SECTION */}
        <AuthProvider>
          <NavbarMainContainer />

          {/* MAIN CONTENT SECTION */}
          <main className="section_container ">
            <Outlet />
          </main>
          {/* tab bar section */}
          <TabBarMainContainer />
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
