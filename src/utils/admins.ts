import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export const getAdmins = async () => {
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
    const response = await axios.get(
      `${base_url}/mgmt/get_admins.php?role=superadmin`,
      { headers }
    );
    const admins = response.data.admins;
    const res = admins.map((admin: any) => {
        return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.is_super_admin ? "superadmin" : "admin",
        }
    })
    return res;
  } catch (error) {}
};
export const addAdmins = async (name: string, email: string) => {
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
    const generatePassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
      let password = "";
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }
      return password;
    };

    const password = generatePassword();
    const data = {
      name,
      email,
      password,
    };

    await axios.post(`${base_url}/mgmt/create_admin.php`, data, { headers });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const deleteAdmins = async (email: string) => {
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
      `${base_url}/mgmt/delete_admin.php`,
      {
        email,
      },
      { headers }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
