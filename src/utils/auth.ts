const isLoggedIn = async () => {
  try {
    const token = localStorage.getItem("psycortex-admin-token");
    if (token) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const sendOTP = async (username: string) => {
  try {
    return {
      success: true,
      message: `OTP sent to ${username}`,
      hashOTP: "random_hash_string_123",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
};

const verifyOTP = async (otp: string, hashOTP: string) => {
  try {
    if (otp === "123456") {
      return {
        success: true,
        message: "OTP verified successfully",
        token: "random_jwt_token_123",
      };
    } else {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to verify OTP",
    };
  }
};

export { isLoggedIn, sendOTP, verifyOTP };
