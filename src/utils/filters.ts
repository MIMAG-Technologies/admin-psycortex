import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

// Fetch All Filters
export const getFilters = async () => {
  try {
    const res = await axios.get(`${base_url}/filter/get_all_filters.php`);
    return res.data.data || {};
  } catch (error) {
    console.error("Error getting filters:", error);
    return {};
  }
};

// Update Priorities (Languages, Specialties, Genders)
export const updatePriorities = async (updates: {
  languages?: { id: number; priority: number }[];
  specialties?: { id: number; priority: number }[];
  genders?: { id: number; priority: number }[];
}) => {
  try {
    const res = await axios.post(
      `${base_url}/filter/update_filters.php`,
      updates
    );
    return res.data;
  } catch (error) {
    console.error("Error updating priorities:", error);
    return null;
  }
};

// Add New Filter Item
export const addFilterItem = async (
  type: "newLanguage" | "newSpecialty" | "newGender",
  name: string,
  priority: number
) => {
  try {
    const res = await axios.post(`${base_url}/filter/update_filters.php`, {
      [type]: name,
      [`${type}Priority`]: priority,
    });
    return res.data;
  } catch (error) {
    console.error(`Error adding ${type}:`, error);
    return null;
  }
};

// Delete Filter Item
export const deleteFilterItem = async (
  type: "deleteLanguage" | "deleteSpecialty" | "deleteGender",
  id: number
) => {
  try {
    const res = await axios.post(`${base_url}/filter/update_filters.php`, {
      [type]: id,
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    return null;
  }
};

// Update Price Range
export const updatePriceRange = async (min: number, max: number) => {
  try {
    const res = await axios.post(`${base_url}/filter/update_filters.php`, {
      priceRange: { min, max },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating price range:", error);
    return null;
  }
};
