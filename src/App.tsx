import { Outlet } from "react-router-dom";

import "./App.css";
import TabBarMainContainer from "./components/partials/navbar_/tabbar-main-container";
import { AuthProvider } from "./provider/context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <div className="w-screen scrollbar-none">
        {/* NAVBAR SECTION */}
        <AuthProvider>
          {/* <NavbarMainContainer /> */}

          {/* MAIN CONTENT SECTION */}
          <main className="section_container ">
            <MainLayout>
              <Outlet />
              <Toaster />
            </MainLayout>
          </main>
          {/* tab bar section */}
          <TabBarMainContainer />
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
