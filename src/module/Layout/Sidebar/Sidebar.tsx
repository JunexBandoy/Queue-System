/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation } from "react-router-dom";
import { SideBarContainer } from "./SideBarContainer";
import { SideBarMenuContainer } from "./SideBarMenuContainer";
import { routes } from "../../../config/routes";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarIcon,
  HomeIcon,
  QueueListIcon,
  ReceiptPercentIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface Props {
  displayName: string;
  email?: string;
}

export const Sidebar: React.FC<Props> = ({ displayName, email }) => {
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "";
  const eMail = email || "";
  const [activeMenu, setActiveMenu] = useState<string | null>(
    localStorage.getItem("activeMenu") || null,
  );
  const location = useLocation();

  // --- NEW: get role from localStorage (as saved in your login flow) ---
  const role = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const user = JSON.parse(raw);
      return user?.role ?? null;
    } catch {
      return null;
    }
  }, [location.pathname]);
  // ---------------------------------------------------------------------

  const setActiveMenuByRoute = (route: any) => {
    if (route === routes.HOME) {
      setActiveMenu("home");
    } else if (route === routes.LAYAWAY) {
      setActiveMenu("layaway");
    } else if (route === routes.QUEUE) {
      setActiveMenu("payments"); // your existing key for the queue menu
    } else if (route === routes.HISTORY) {
      setActiveMenu("history");
    } else if (route === routes.DASHBOARD) {
      setActiveMenu("dashboard");
    } else if (route === routes.EMPLOYEE) {
      setActiveMenu("dashboard");
    } else if (route === routes.INVENTORY) {
      setActiveMenu("dashboard");
    }
  };

  useEffect(() => {
    setActiveMenu(localStorage.getItem("activeMenu") || null);
    setActiveMenuByRoute(location.pathname);
  }, [location.pathname]);

  const handleMenuClick = (menu: any) => {
    setActiveMenu(menu);
    localStorage.setItem("activeMenu", menu);
  };

  const activeMenuClass = (menu: any) =>
    activeMenu === menu
      ? "shadow-lg text-black py-0.5 font-semibold text-[14px] pl-8 pr-4 w-full space-y-3 border-b-2 border-[#03D79A]"
      : "hover:shadow-lg fill-[#27401A] pr-4 pl-8 py-0.5 hover:bg-gray-200 w-full hover:font-semibold text-[14px] space-y-3";

  // --- Decide what to render based on role ---
  const isAdmin = role === "admin"; // change if your admin value differs
  const isSubAdmin = role === "Subadmin";
  // For non-admins, show only the Queue (Payments) section.
  // ---------------------------------------------------------------------

  return (
    <>
      <SideBarContainer>
        <div className="py-8 px-10">
          <div className="flex justify-center items-center gap-x-2 w-full border-b border-gray-300 pb-6">
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-[#03D79A] outline -outline-offset-1 outline-black/5 dark:bg-gray-300 border-black border">
              <span className="text-md font-medium ">{initial}</span>
            </div>
            <div className="text-center">
              <div className="font-semibold text-black ">{displayName}</div>
              <div className="text-sm">{eMail}</div>
            </div>
          </div>
        </div>

        <div className="block gap-2 divide-y-2 divide-gray-300">
          {/* --- Admin-only block: Explore + Dashboard --- */}
          {isAdmin && (
            <div className="block py-2">
              <div className="px-8 text-lg pb-2">Explore</div>
              <SideBarMenuContainer>
                <Link
                  to={`${routes.DASHBOARD}`}
                  onClick={() => handleMenuClick("dashobard")}
                >
                  <div className={`${activeMenuClass("dashobard")}`}>
                    <div className="flex items-center py-3 space-x-4">
                      <HomeIcon height="24" width="24" />
                      <h1 className="flex items-center">Dashboard</h1>
                    </div>
                  </div>
                </Link>
              </SideBarMenuContainer>
            </div>
          )}

          <div className="block py-2">
            {/* --- Section title varies: Admin sees "You"; non-admin can keep same for simplicity --- */}
            <div className="px-8 text-lg pb-2">You</div>

            {/* --- Admin-only items --- */}
            {isAdmin && (
              <>
                <SideBarMenuContainer>
                  <Link
                    to={`${routes.HISTORY}`}
                    onClick={() => handleMenuClick("history")}
                  >
                    <div className={`${activeMenuClass("history")}`}>
                      <div className="flex items-center py-3 space-x-4">
                        <CalendarIcon height="24" width="24" />
                        <h1 className="flex items-center">Employee</h1>
                      </div>
                    </div>
                  </Link>
                </SideBarMenuContainer>

                <SideBarMenuContainer>
                  <Link
                    to={`${routes.LAYAWAY}`}
                    onClick={() => handleMenuClick("layaway")}
                  >
                    <div className={`${activeMenuClass("layaway")}`}>
                      <div className="flex items-center py-3 space-x-4">
                        <HomeIcon height="24" width="24" />
                        <h1 className="flex items-center">Application</h1>
                      </div>
                    </div>
                  </Link>
                </SideBarMenuContainer>
              </>
            )}

            {/* --- Shown to everyone: Queuing (your "payments" key) --- */}

            <SideBarMenuContainer>
              <Link
                to={`${routes.QUEUE}`}
                onClick={() => handleMenuClick("payments")}
              >
                <div className={`${activeMenuClass("payments")}`}>
                  <div className="flex items-center py-3 space-x-4">
                    <QueueListIcon height="24" width="24" />
                    <h1 className="flex items-center">Queuing</h1>
                  </div>
                </div>
              </Link>
            </SideBarMenuContainer>

            {/* --- Admin-only items --- */}
            {isAdmin && (
              <>
                <SideBarMenuContainer>
                  <Link
                    to={`${routes.HISTORY}`}
                    onClick={() => handleMenuClick("history")}
                  >
                    <div className={`${activeMenuClass("history")}`}>
                      <div className="flex items-center py-3 space-x-4">
                        <CalendarIcon height="24" width="24" />
                        <h1 className="flex items-center">Inventory</h1>
                      </div>
                    </div>
                  </Link>
                </SideBarMenuContainer>

                <SideBarMenuContainer>
                  <Link to="" onClick={() => handleMenuClick("")}>
                    <div className={`${activeMenuClass("")}`}>
                      <div className="flex items-center py-3 space-x-4">
                        <ReceiptPercentIcon height="24" width="24" />
                        <h1 className="flex items-center">Reports</h1>
                      </div>
                    </div>
                  </Link>
                </SideBarMenuContainer>

                <SideBarMenuContainer>
                  <Link to="" onClick={() => handleMenuClick("accounts")}>
                    <div className={`${activeMenuClass("accounts")}`}>
                      <div className="flex items-center py-3 space-x-4">
                        <UserCircleIcon height="24" width="24" />
                        <h1 className="flex items-center">Accounts</h1>
                      </div>
                    </div>
                  </Link>
                </SideBarMenuContainer>
              </>
            )}
            {isSubAdmin && (
              <SideBarMenuContainer>
                <Link
                  to={`${routes.QUEUE}`}
                  onClick={() => handleMenuClick("payments")}
                >
                  <div className={`${activeMenuClass("payments")}`}>
                    <div className="flex items-center py-3 space-x-4">
                      <QueueListIcon height="24" width="24" />
                      <h1 className="flex items-center">Queuing</h1>
                    </div>
                  </div>
                </Link>
              </SideBarMenuContainer>
            )}
          </div>
        </div>
      </SideBarContainer>
    </>
  );
};
