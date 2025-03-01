"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { IoPeople, IoDocumentText, IoCalendar } from "react-icons/io5";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Define tab structure
  const tabs = [
    {
      name: "All Counsellors",
      path: "/counsellors",
      icon: <IoPeople size={18} />,
    },
    {
      name: "Applications",
      path: "/counsellors/applications",
      icon: <IoDocumentText size={18} />,
    },
    {
      name: "Leaves",
      path: "/counsellors/leaves",
      icon: <IoCalendar size={18} />,
    },
  ];

  return (
    <div className="w-full">
      {/* Navigation Header */}
      <div className="flex items-center justify-center gap-5 sm:gap-20 px-6 py-3 border-b bg-white shadow-sm sticky top-0">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`flex items-center gap-2 px-3 py-2 text-gray-700 font-medium transition-all ${
              pathname === tab.path
                ? "border-b-2 border-purple-600 text-purple-700"
                : "border-b-2 border-transparent"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.name}</span>
          </Link>
        ))}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
