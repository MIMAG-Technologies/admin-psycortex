import { toast } from "react-toastify";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
const isLoggedIn = async () => {
  try {
    const token = localStorage.getItem("psycortex-admin-token");
    if (!token) {
      toast.error("Please login first!");
      return false;
    }
    await axios.get(`${base_url}/admin/is_logged_in.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    return true;
  } catch (error) {
    return false;
  }
};

const sendOTP = async (username: string) => {
  try {

    const res = await axios.post(`${base_url}/admin/send_otp.php`, {
      username
    });
    toast.success("Otp sent to your mail!")
    return res.data;
  } catch (error) {
    toast.error("Failed to send OTP!")
    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
};

const verifyOTP = async (otp: string, hashOTP: string) => {
  try {

    const res = await axios.post(`${base_url}/admin/verify_otp.php`, {
      otp,
      hashOTP
    });
    toast.success("OTP verified!")
    return res.data;
  } catch (error) {
    toast.error("Invalid OTP!")
    return {
      success: false,
      message: "Failed to verify OTP",
    };
  }
};

export { isLoggedIn, sendOTP, verifyOTP };
