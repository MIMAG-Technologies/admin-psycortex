import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Creates a new counsellor
 * @param name - Counsellor's name
 * @param email - Counsellor's email
 * @param phone - Counsellor's phone number
 * @param timezone - Counsellor's timezone
 * @returns The created counsellor's ID or empty string on failure
 */
export const createCounsellor = async (
  name: string,
  email: string,
  phone: string,
  timezone: string
): Promise<string> => {
  try {
    const response = await axios.post(
      `${base_url}/counsellor/create_counsellor.php`,
      {
        name,
        email,
        phone,
        timezone,
      }
    );
    return response.data.counsellorId || "";
  } catch (error) {
    console.error("Error creating counsellor:", error);
    return "";
  }
};

/**
 * Updates counsellor's personal information
 * @param counsellorId - Counsellor's ID
 * @param personalInfo - Object containing personal information
 * @returns Boolean indicating success or failure
 */
export const updatePersonalInfo = async (
  counsellorId: string,
  personalInfo: {
    name: string;
    dateOfBirth?: string;
    gender?: string;
    profileImage?: string;
    biography?: string;
    email: string;
    phone: string;
  }
): Promise<boolean> => {
  try {
    await axios.post(`${base_url}/counsellor/update_personal_info.php`, {
      counsellorId,
      ...personalInfo,
    });

    return true;
  } catch (error) {
    console.error("Error updating personal info:", error);
    return false;
  }
};

/**
 * Updates counsellor's professional information
 * @param counsellorId - Counsellor's ID
 * @param professionalInfo - Object containing professional information
 * @returns Boolean indicating success or failure
 */
export const updateProfessionalInfo = async (
  counsellorId: string,
  professionalInfo: {
    title: string;
    yearsOfExperience: number;
    education: Array<{
      degree: string;
      field: string;
      institution: string;
      year: number;
    }>;
  }
): Promise<boolean> => {
  try {
    await axios.post(`${base_url}/counsellor/update_professional_info.php`, {
      counsellorId,
      ...professionalInfo,
    });

    return true;
  } catch (error) {
    console.error("Error updating professional info:", error);
    return false;
  }
};

/**
 * Updates counsellor's pricing information
 * @param counsellorId - Counsellor's ID
 * @param rates - Array of session rates
 * @returns Boolean indicating success or failure
 */
export const updatePricing = async (
  counsellorId: string,
  rates: Array<{
    sessionType: string;
    sessionTitle: string;
    typeOfAvailability: string;
    price: number;
    currency: string;
  }>
): Promise<boolean> => {
  try {
    await axios.post(`${base_url}/counsellor/update_pricing.php`, {
      counsellorId,
      rates,
    });

    return true;
  } catch (error) {
    console.error("Error updating pricing:", error);
    return false;
  }
};

/**
 * Updates counsellor's communication modes
 * @param counsellorId - Counsellor's ID
 * @param communicationModes - Comma-separated string of communication modes
 * @returns Boolean indicating success or failure
 */
export const updateCommunicationModes = async (
  counsellorId: string,
  communicationModes: string
): Promise<boolean> => {
  try {
    await axios.post(
      `${base_url}/counsellor/update_counsellor_communication.php`,
      {
        counsellor_id: counsellorId,
        communication_modes: communicationModes,
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating communication modes:", error);
    return false;
  }
};

/**
 * Updates counsellor's weekly schedule
 * @param counsellorId - Counsellor's ID
 * @param weeklySchedule - Array of daily schedules
 * @returns Boolean indicating success or failure
 */
export const updateSchedule = async (
  counsellorId: string,
  weeklySchedule: Array<{
    day: string;
    startTime?: string;
    endTime?: string;
    isWorkingDay: boolean;
  }>
): Promise<boolean> => {
  try {
    await axios.post(`${base_url}/counsellor/update_schedule.php`, {
      counsellorId,
      weeklySchedule,
    });

    return true;
  } catch (error) {
    console.error("Error updating schedule:", error);
    return false;
  }
};

/**
 * Updates counsellor's languages
 * @param counsellorId - Counsellor's ID
 * @param languages - Array of language proficiencies
 * @returns Boolean indicating success or failure
 */
export const updateLanguages = async (
  counsellorId: string,
  languages: Array<{
    language: string;
    proficiencyLevel: string;
  }>
): Promise<boolean> => {
  try {
    await axios.post(`${base_url}/counsellor/update_languages.php`, {
      counsellorId,
      languages,
    });

    return true;
  } catch (error) {
    console.error("Error updating languages:", error);
    return false;
  }
};

/**
 * Updates counsellor's specialties
 * @param counsellorId - Counsellor's ID
 * @param specialties - Array of specialties
 * @returns Boolean indicating success or failure
 */
export const updateSpecialties = async (
  counsellorId: string,
  specialties: string[]
): Promise<boolean> => {
  try {
    await axios.post(`${base_url}/counsellor/update_specialties.php`, {
      counsellorId,
      specialties,
    });

    return true;
  } catch (error) {
    console.error("Error updating specialties:", error);
    return false;
  }
};

/**
 * Updates counsellor's profile picture
 * @param counsellorId - Counsellor's ID
 * @param imageFile - Profile image file
 * @returns Boolean indicating success or failure
 */
export const updateProfilePic = async (
  counsellorId: string,
  imageFile: File
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append("ID", counsellorId);
    formData.append("Image", imageFile);

    await axios.post(
      `${base_url}/counsellor/update_profile_pic.php`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return false;
  }
};

/**
 * Updates counsellor's verification status
 * @param counsellorId - Counsellor's ID
 * @param verificationData - Object containing verification information
 * @returns Boolean indicating success or failure
 */
export const updateVerification = async (
  counsellorId: string,
  verificationData: {
    isVerified: boolean;
    documentsVerified: boolean;
    backgroundCheckDate: string;
  }
): Promise<boolean> => {
  try {
    await axios.post(`${base_url}/counsellor/update_verification.php`, {
      counsellorId,
      ...verificationData,
    });

    return true;
  } catch (error) {
    console.error("Error updating verification status:", error);
    return false;
  }
};


export const getCounsellor = async (counsellorId: string) => {
  try {
    const response = await axios.post(
      `${base_url}/counsellor/get_counsellor_details.php?counsellorId=${counsellorId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error getting counsellor:", error);
    return null;
  }
}

export const getCounsellors = async () => {
  try {
    const response = await axios.get(
      `${base_url}/counsellor/get_counsellors_all.php`
    );
    return response.data.counsellors;
  } catch (error) {
    console.error("Error getting counsellors:", error);
    return [];
  }
}