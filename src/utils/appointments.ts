import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

interface AppointmentParams {
  page?: Number;
  from?: string;
  to?: string;
  mode?: "chat" | "counselling" | "offline";
  happened?: boolean | null;
}

export const getAppointments = async ({
  page = 1,
  from,
  to,
  mode,
  happened,
}: AppointmentParams = {}) => {
  try {
    const token = localStorage.getItem("psycortex-admin-token");
    if (!token) {
      toast.error("Please login first!");
      throw new Error("Please login first!");
    }

    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (mode) params.append("mode", mode);
    if (happened !== undefined) params.append("happened", String(happened));

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(
      `${base_url}/admin/get_appointments.php?${params.toString()}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};
