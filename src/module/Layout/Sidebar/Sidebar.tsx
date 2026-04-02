/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation } from "react-router-dom";
import { SideBarContainer } from "./SideBarContainer";
import { SideBarMenuContainer } from "./SideBarMenuContainer";
import { routes } from "../../../config/routes";
import { useEffect, useMemo, useState } from "react";
import {
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

  // Read role from localStorage.user.role and normalize to lowercase
  const role = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const user = JSON.parse(raw);
      const r = (user?.role ?? "").toString().trim().toLowerCase();
      return r || null; // "admin" or "user"
    } catch {
      return null;
    }
  }, [location.pathname]);

  const isAdmin = role === "admin";
  const isUser = role === "user";
  const isPacd = role === "pacd";

  const setActiveMenuByRoute = (routePath: string) => {
    if (routePath === routes.HOME) {
      setActiveMenu("home");
    } else if (routePath === routes.ACCOUNTS) {
      setActiveMenu("accounts");
    } else if (routePath === routes.QUEUE) {
      setActiveMenu("queque"); // keep your existing key
    } else if (routePath === routes.ADMIN) {
      setActiveMenu("queque"); // keep your existing key
    } else if (routePath === routes.HISTORY) {
      setActiveMenu("reports");
    } else if (routePath === routes.DASHBOARD) {
      setActiveMenu("dashobard"); // note: your key is "dashobard" (typo preserved)
    } else if (routePath === routes.EMPLOYEE) {
      setActiveMenu("dashobard");
    } else if (routePath === routes.INVENTORY) {
      setActiveMenu("dashobard");
    }
  };

  useEffect(() => {
    const current = localStorage.getItem("activeMenu");
    if (!current) return;

    if (isUser) {
      if (current !== "queque") {
        localStorage.setItem("activeMenu", "queque");
        setActiveMenu("queque");
      }
    }

    if (isPacd) {
      if (current !== "queque") {
        localStorage.setItem("activeMenu", "queque");
        setActiveMenu("queque");
      }
    }
  }, [isAdmin, isUser, isPacd]);

  // Optional: keep activeMenu valid for the current role
  useEffect(() => {
    const current = localStorage.getItem("activeMenu");
    if (!current) return;

    if (isUser) {
      // user can only see "queque"
      if (current !== "queque") {
        localStorage.setItem("activeMenu", "queque");
        setActiveMenu("queque");
      }
    }
    // admins can keep any of the defined keys
  }, [isAdmin, isUser]);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    localStorage.setItem("activeMenu", menu);
  };

  const activeMenuClass = (menu: string) =>
    activeMenu === menu
      ? "shadow-lg text-black py-0.5 font-semibold text-[14px] pl-8 pr-4 w-full space-y-3 border-b-2 border-[#03D79A]"
      : "hover:shadow-lg fill-[#27401A] pr-4 pl-8 py-0.5 hover:bg-gray-200 w-full hover:font-semibold text-[14px] space-y-3";

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
          {/* Admin-only: Explore / Dashboard */}
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
            {/* Admin-only items */}
            {isAdmin && (
              <>
                <SideBarMenuContainer>
                  <Link
                    to={`${routes.ADMIN}`}
                    onClick={() => handleMenuClick("queque")}
                  >
                    <div className={`${activeMenuClass("queque")}`}>
                      <div className="flex items-center py-3 space-x-4">
                        <QueueListIcon height="24" width="24" />
                        <h1 className="flex items-center">Queuing</h1>
                      </div>
                    </div>
                  </Link>
                </SideBarMenuContainer>

                <SideBarMenuContainer>
                  <Link
                    to={`${routes.HISTORY}`}
                    onClick={() => handleMenuClick("reports")}
                  >
                    <div className={`${activeMenuClass("reports")}`}>
                      <div className="flex items-center py-3 space-x-4">
                        <ReceiptPercentIcon height="24" width="24" />
                        <h1 className="flex items-center">Reports</h1>
                      </div>
                    </div>
                  </Link>
                </SideBarMenuContainer>

                <SideBarMenuContainer>
                  <Link
                    to={`${routes.ACCOUNTS}`}
                    onClick={() => handleMenuClick("accounts")}
                  >
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

            {/* User-only (non-admin) — show only Queuing */}
            {isUser && (
              <SideBarMenuContainer>
                <Link
                  to={`${routes.QUEUE}`}
                  onClick={() => handleMenuClick("queque")}
                >
                  <div className={`${activeMenuClass("queque")}`}>
                    <div className="flex items-center py-3 space-x-4">
                      <QueueListIcon height="24" width="24" />
                      <h1 className="flex items-center">Queuing</h1>
                    </div>
                  </div>
                </Link>
              </SideBarMenuContainer>
            )}
            {isPacd && (
              <SideBarMenuContainer>
                <Link
                  to={`${routes.ADMIN}`}
                  onClick={() => handleMenuClick("queque")}
                >
                  <div className={`${activeMenuClass("queque")}`}>
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
