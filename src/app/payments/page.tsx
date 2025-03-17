"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/payments/records"); // Redirect to /payments/records
  }, []);

  return null; // No UI needed
}
