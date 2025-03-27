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

export const getCounsellorSchedule = async (
  counsellorId: string,
  date: string
) => {
  try {
    const res = await axios.get(
      `${base_url}/counsellor/get_counsellor_schedule.php?counsellorId=${counsellorId}`
    );
    const weeklySchedule = res.data.weeklySchedule;
    const dailySchedule = weeklySchedule.filter(
      (schedule: any) => schedule.date === date
    );
    const workingHours = dailySchedule[0].slots;
    const availableHours = workingHours.filter(
      (hour: any) => hour.is_available === true
    );
    return availableHours;
  } catch {
    console.error("Error fetching counsellor schedule");
    return [];
  }
};

export const BookSchedule = async (
  user_id: string,
  counsellor_id: string,
  scheduled_at: string,
  notes: string,
  location: string,
  duration: string
) => {
  try {
    const token = localStorage.getItem("psycortex-admin-token");
    if (!token) {
      toast.error("Please login first!");
      throw new Error("Please login first!");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    await axios.post(
      `${base_url}/admin/book_appointment.php`,
      {
        user_id,
        counsellor_id,
        scheduled_at,
        notes,
        location,
        duration,
      },
      { headers }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const CancleSchedule = async (
  user_id: string,
  counsellor_id: string,
  scheduled_at: string,
) => {
  try {
    const token = localStorage.getItem("psycortex-admin-token");
    if (!token) {
      toast.error("Please login first!");
      throw new Error("Please login first!");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    await axios.post(
      `${base_url}/admin/cancel_appointment.php`,
      {
        user_id,
        counsellor_id,
        scheduled_at,
      },
      { headers }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
