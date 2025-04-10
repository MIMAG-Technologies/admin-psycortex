"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  FaCalendarCheck,
  FaUserMd,
  FaUsers,
  FaFilter,
  FaMoneyBillWave,
  FaFileSignature,
  FaBuilding,
  FaUserShield,
} from "react-icons/fa";
import { BiX } from "react-icons/bi";

export default function SideNavbar({
  isSidebarOpen,
  setSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  const routes: { name: string; icon: ReactNode; path: string }[] = [
    { name: "Users", icon: <FaUsers />, path: "/users" },
    { name: "Appointments", icon: <FaCalendarCheck />, path: "/appointments" },
    { name: "Counsellors", icon: <FaUserMd />, path: "/counsellors" },
    { name: "Tests", icon: <FaFileSignature />, path: "/tests" },
    { name: "Filters", icon: <FaFilter />, path: "/filters" },
    { name: "Payments", icon: <FaMoneyBillWave />, path: "/payments" },
    { name: "Branches", icon: <FaBuilding />, path: "/branches" },
    { name: "Admin", icon: <FaUserShield />, path: "/admin" },
  ];
  

  return (
    <>
      {/* Sidebar for Large Screens */}
      <nav className="hidden lg:flex w-[250px] h-full bg-gray-100 text-gray-800 flex-col gap-2 p-4 border-r border-gray-300">
        {routes.map(({ name, icon, path }) => {
          const isActive = pathname.includes(path);
          return (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "bg-white hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300"
                }
              `}
            >
              <span className="text-lg">{icon}</span>
              <span className="font-medium">{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar for Small Screens (Slide-In) */}
      <div
        className={`fixed top-0 left-0 h-full w-[250px] bg-gray-100 p-4 border-r border-gray-300 flex flex-col gap-4 transition-transform duration-300 
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden z-50`}
      >
        {/* Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-2xl text-gray-700"
        >
          <BiX />
        </button>

        {routes.map(({ name, icon, path }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "bg-white hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300"
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">{icon}</span>
              <span className="font-medium">{name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
