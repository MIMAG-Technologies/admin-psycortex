"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";
import { useLoading } from "@/context/LoadingContext";

export default function AuthChecker() {
  const router = useRouter();
   const pathname = usePathname();
      const { setLoading } = useLoading();
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      const isLogged = await isLoggedIn();
      if (isLogged) {
        if(pathname === "/" || pathname === "/login"){
            router.push("/users");
          }
        }
        else{
          router.push("/login");
        }
        setLoading(false);
    };
    checkAuth();
  }, [router]);

  return null;
}
