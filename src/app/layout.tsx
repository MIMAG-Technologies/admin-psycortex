"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SideNavbar from "@/components/SideNavbar";
import "./globals.css";
import { BiExit, BiMenu } from "react-icons/bi";
import Loading from "@/components/Loading";
import { LoadingProvider } from "@/context/LoadingContext";
import { ToastContainer, Bounce, toast } from "react-toastify";
import AuthChecker from "@/components/AuthChecker";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("psycortex-admin-token");
    toast.success("Logged out Successfully!")
    router.push("/login");
  };


  return (
    <html lang="en">
      <head>
        <title>Admin Panel | Psycortex</title>
        <meta
          name="description"
          content="Psycortex Admin Panel for managing appointments and users"
        />
        <link rel="icon" href="https://psycortex.in/favicon.ico" />
      </head>
      <body>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
            transition={Bounce}
          />
        <LoadingProvider>
          {isLoginPage ? (
            <>
              {children}
              <Loading />
            </>
          ) : (
            <>
              {/* Navbar */}
              <nav className="flex justify-between items-center p-4 bg-slate-100 border-b border-slate-200">
                {/* Sidebar Toggle Button (Visible on Small Screens) */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-2xl text-gray-700"
                >
                  <BiMenu />
                </button>
                <span className="font-bold text-lg">Admin Panel</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white font-bold bg-red-400 hover:bg-red-500 rounded-md transition-colors"
                >
                  <BiExit className="text-lg" />
                  Logout
                </button>
              </nav>

              {/* Sidebar + Main Content */}
              <div className="flex h-[90vh]">
                {/* Sidebar (Hidden on Small Screens, Slide-In Effect) */}
                <SideNavbar
                  isSidebarOpen={isSidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />

                {/* Main Content (Full Width on Small Screens) */}
                <main
                  className={`h-full transition-all duration-300 ${
                    isSidebarOpen ? "w-0" : "w-full lg:w-[calc(100vw-250px)]"
                  } overflow-y-scroll overflow-x-hidden`}
                >
                  <AuthChecker />
                  {children}
                  <Loading />
                </main>
              </div>
            </>
          )}
        </LoadingProvider>
      </body>
    </html>
  );
}
