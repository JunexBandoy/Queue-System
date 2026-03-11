/* eslint-disable @typescript-eslint/no-unused-vars */

import { signOut } from "firebase/auth";

import { useState } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { PPDLogoFull } from "../../core/components/Icons";
import { Link, useLocation, useNavigate } from "react-router";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { routes } from "../../config/routes";
import { logout } from "../../Auth/Auth";

interface Props {
  children?: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add loading state
  const navigate = useNavigate(); // For redirect after logout

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(); // Call your logout function
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local storage even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSideBarButton = () => {
    setShowSidebar(!showSidebar);
  };

  const routesMap: Record<string, string> = {
    [routes.DASHBOARD]: "Dashboard",
    [routes.LAYAWAY]: "layaway",
    [routes.QUEUE]: "QUEUING",
    [routes.HISTORY]: "history",
  };
  const location = useLocation();
  const pageTitle = routesMap[location.pathname] || "";

  return (
    <>
      <>
        <div className="flex px-8 py-3 justify-between bg-white shadow-lg">
          <PPDLogoFull width="120" />
        </div>
        <div className="h-full">
          <div className="grid h-full gap-0 grid-cols-6">
            {showSidebar && <Sidebar displayName={"Admin"} />}

            <div
              className={`h-full ${showSidebar ? "col-span-5" : "col-span-6"}`}
            >
              <div className="flex justify-between items-center bg-[#03D79A] p-4 text-white">
                <div className="flex justify-start items-center gap-6">
                  <button onClick={handleSideBarButton}>
                    <Bars3Icon
                      className="text-white stroke-2"
                      height="28"
                      width="28"
                    />
                  </button>
                  <div className=" text-base uppercase text-black font-semibold tracking-widest ">
                    {pageTitle}
                  </div>
                </div>

                <div className="flex space-x-4 items-center">
                  <Link
                    className="px-2 hover:border-b hover:border-gray-500 border-b border-transparent py-0.5"
                    to="/"
                  >
                    Home
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex justify-end rounded-full text-black bg-white px-6 py-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                  {/* <button className="flex justify-end rounded-full  text-black bg-white px-6 py-2">
                    Logout
                  </button> */}
                </div>
              </div>
              <div
              // className={`${
              //   !!userAuth.user ? "px-4 py-4 bg-gray-100" : "hidden"
              // }`}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};
