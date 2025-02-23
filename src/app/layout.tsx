import SideNavbar from "@/components/SideNavbar";
import "./globals.css";
import { BiExit } from "react-icons/bi";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="flex justify-between items-center p-4 bg-slate-100 border-b border-slate-200">
          <span className="font-bold text-lg" >Admin Panel</span>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-white font-bold bg-red-400 hover:bg-red-500 rounded-md transition-colors"> 
            <BiExit className="text-lg"/> 
            Logout
            </button>
        </nav>
        <div className="flex gap-1 h-[90vh]">
        <SideNavbar />
        <main className="h-full w-[calc(100vw-250px)] overflow-y-scroll overflow-x-hidden" >{children}</main>
        </div>
      </body>
    </html>
  );
}
