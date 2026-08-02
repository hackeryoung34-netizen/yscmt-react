import { useCallback } from "react";
import { Link, useLocation } from "react-router";

import {
  BoxCubeIcon,
  CalenderIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";

import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/",
  },
  {
    name: "Courses",
    icon: <BoxCubeIcon />,
    path: "/courses",
  },
  {
    name: "Lessons",
    icon: <ListIcon />,
    path: "/lessons",
  },
  {
    name: "Students",
    icon: <UserCircleIcon />,
    path: "/students",
  },
  {
    name: "Quiz Attempts",
    icon: <PageIcon />,
    path: "/quiz-attempts",
  },
  {
    name: "Certificates",
    icon: <TableIcon />,
    path: "/certificates",
  },
  {
    name: "Payments",
    icon: <PieChartIcon />,
    path: "/payments",
  },
  {
    name: "Notifications",
    icon: <PlugInIcon />,
    path: "/notifications",
  },
  {
    name: "Profile",
    icon: <UserCircleIcon />,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: <CalenderIcon />,
    path: "/settings",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 lg:mt-0 h-screen border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered
            ? "justify-center"
            : "justify-start px-5"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                src="/images/logo/logo.svg"
                className="dark:hidden"
                alt="Logo"
                width={150}
              />
              <img
                src="/images/logo/logo-dark.svg"
                className="hidden dark:block"
                alt="Logo"
                width={150}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
            />
          )}
        </Link>
      </div>

      <div className="overflow-y-auto no-scrollbar px-5">
        <h2 className="mb-4 text-xs uppercase text-gray-400">
          {isExpanded || isHovered || isMobileOpen ? "LMS" : "..."}
        </h2>

        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`menu-item group ${
                  isActive(item.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(item.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {item.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {(isExpanded || isHovered || isMobileOpen) && (
          <SidebarWidget />
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
