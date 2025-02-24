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
  FaSlidersH,
  FaFileSignature,
} from "react-icons/fa";


export default function SideNavbar() {
  const pathname = usePathname();

  const routes: { name: string; icon: ReactNode; path: string }[] = [
    { name: "Appointments", icon: <FaCalendarCheck />, path: "/appointments" },
    { name: "Counsellors", icon: <FaUserMd />, path: "/counsellors" },
    { name: "Users", icon: <FaUsers />, path: "/users" },
    { name: "Tests", icon: <FaFileSignature  />, path: "/tests" },
    { name: "Filters", icon: <FaFilter />, path: "/filters" },
    { name: "Payments", icon: <FaMoneyBillWave />, path: "/payments" },
    { name: "Variables", icon: <FaSlidersH />, path: "/variables" },
  ];

  return (
    <nav className="w-[250px] h-full bg-gray-100 text-gray-800 flex flex-col gap-2 p-4 border-r border-gray-300">
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
          >
            <span className="text-lg">{icon}</span>
            <span className="font-medium">{name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
