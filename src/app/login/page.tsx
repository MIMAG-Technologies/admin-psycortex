"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { sendOTP, verifyOTP } from "@/utils/auth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [hashOTP, setHashOTP] = useState("");
  const [step, setStep] = useState(1);
  const { setLoading } = useLoading();
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!username.trim()) {
      toast.warn("Please enter a username");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const response = await sendOTP(username);
      setLoading(false);

      if (response.success && response.hashOTP) {
        setHashOTP(response.hashOTP);
        setStep(2);
      }
    }, 800);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast.info("Please enter OTP");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const response = await verifyOTP(otp, hashOTP);
      setLoading(false);

      if (response.success && response.token) {
        localStorage.setItem("psycortex-admin-token", response.token);
        router.push("/appointments");
      }
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md text-center">
        {/* Logo & Company Name */}
        <img
          src="https://psycortex.in/assets/Images/thebraintakeLogo.png"
          alt="Psycortex Logo"
          className="mx-auto h-16 mb-4"
        />
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin Panel Login
        </h1>
        <p className="text-gray-500 mb-6">Psycortex</p>

        {/* Step 1: Enter Username */}
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-outline"
            />
            <button
              onClick={handleSendOTP}
              className="w-full mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
