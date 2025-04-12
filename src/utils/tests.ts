import axios from "axios";
import { toast } from "react-toastify";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;
export const fetchTests = async () => {
  try {
    const response = await axios.get(`${base_url}/tests/get_all_tests.php`);
    return response.data.tests || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updatetest = async (data: {
  slug: string;
  name: string;
  description: string;
  price: number;
  taxPercent: number;
  benefits: string;
  durationMinutes: number;
  shortDescription: string;
}) => {
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
      `${base_url}/admin/update_test_metadata.php`,
      {
        slug: data.slug,
        name: data.name,
        description: data.description,
        price: data.price,
        tax_percent: data.taxPercent,
        benefits: data.benefits,
        duration_minutes: data.durationMinutes,
        short_description: data.shortDescription,
      },
      { headers }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createDiscount = async (data: {
  name: string;
  discountPercent: number;
  expiresOn: string;
  description: string;
}) => {
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
    await axios.post(`${base_url}/tests/update_discount.php`, data, {
      headers,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const disableDiscount = async () => {
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
    await axios.post(`${base_url}/tests/disable_discounts.php`, { headers });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const UpdatePriorities = async (
  test_priorities: Array<{ slug: string; priority: number }>
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
    await axios.post(`${base_url}/mods/set_test_priority.php`, {
      test_priorities,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
