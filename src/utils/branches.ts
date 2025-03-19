import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export const getBranches = async () => {
  try {
    const response = await axios.get(`${base_url}/counsellor/get_branches.php`);
    return response.data.data.branches || [];
  } catch (err) {
    return [];
  }
};

export const addBranche = async (
  city: string,
  street_address: string,
  state: string,
  pincode: string
) => {
  try {
     await axios.post(
      `${base_url}/counsellor/add_branch.php`,
      {
        city,
        street_address,
        state,
        pincode,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};
export const deleteBranche = async (id:string)=>{
    try {
      await axios.delete(`${base_url}/counsellor/delete_branch.php?id=${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }
