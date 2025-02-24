"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";

export default function AuthChecker() {
  const router = useRouter();
   const pathname = usePathname();
  useEffect(() => {
    const checkAuth = async () => {
      const isLogged = await isLoggedIn();
      if (isLogged) {
        if(pathname === "/" || pathname === "/login"){
            router.push("/appointments");
        }
      }
      else{
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return null;
}
