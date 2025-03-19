import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export const getBranches = async () => {
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
      `${base_url}/counsellor/get_branches.php`,
      { headers }
    );
    return response.data.data.branches || [];
  } catch (err) {
    return [];
  }
};

export const addBranches = async (
  city: string,
  street_address: string,
  state: string,
  pincode: string
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
      `${base_url}/counsellor/add_branch.php`,
      {
        city,
        street_address,
        state,
        pincode,
      },
      { headers }
    );
    return true;
  } catch (error) {
    return false;
  }
};
export const deleteBranches = async (id: string) => {
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
    await axios.delete(`${base_url}/counsellor/delete_branch.php?id=${id}`, {
      headers,
    });
    return true;
  } catch (error) {
    return false;
  }
};
