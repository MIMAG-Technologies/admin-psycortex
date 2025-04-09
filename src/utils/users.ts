import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

const fetchUsers = async (search: string, page: Number) => {
  try {
    const res = await axios.get(
      base_url + "/offline/getUsers.php?search=" + search + "&page=" + page
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return {
      users: [],
      currentPage: Number(page),
      totalPages: 0,
    };
  }
};

export const getUserRecords = async (user_id: string) => {
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
    const res = await axios.get(
      base_url + "/admin/get_last_user_record.php?user_id=" + user_id,
      { headers }
    );
    return res.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const returnAppointmentUsers = async (search: string) => {
  try {
    const res = await axios.get(
      base_url + "/offline/getUsers.php?search=" + search
    );
    const userList = res.data.users;
    let returnlist: Array<{
      label: string;
      value: string;
      age: number;
      phone: string;
      gender: string;
      profile_image: string;
    }> = [];
    userList.forEach((user: any) => {
      returnlist.push({
        label: user.name,
        value: user.id,
        age: calculateAge(user.date_of_birth),
        phone: user.phone,
        gender: user.gender,
        profile_image: user.profile_image || "/images/user-dummy-img.png",
      });
    });
    return returnlist;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const createUser = async (
  name: string,
  email: string,
  phone: string | number,
  date_of_birth: string,
  gender: string
) => {
  try {
    await axios.post(base_url + "/offline/create_user.php", {
      name,
      email,
      phone,
      dateOfBirth: date_of_birth,
      gender,
      profileImage:
        "https://soundofmeme.s3.amazonaws.com/profile-yeah3977_20250121_122114.png",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { fetchUsers, createUser };

function calculateAge(date_of_birth: string): number {
  const birthDate = new Date(date_of_birth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export const getUserHistory = async (user_id: string) => {
  try {
    const res = await axios.get(
      base_url + "/user/get_case_history.php?user_id=" + user_id
    );
    return res.data.histories;
  } catch (error) {
    console.log(error);
    return [];
  }
};
