import {
  BranchType,
  Education,
  Language,
  License,
  PricingItem,
  ScheduleItem,
} from "@/types/counsellors";
import axios from "axios";
import FormData from "form-data";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

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
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.counsellorId || "";
  } catch (error) {
    console.error("Error creating counsellor:", error);
    return "";
  }
};

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
    await axios.post(
      `${base_url}/counsellor/update_personal_info.php`,
      {
        counsellorId,
        ...personalInfo,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating personal info:", error);
    return false;
  }
};

export const updateProfessionalInfo = async (
  counsellorId: string,
  professionalInfo: {
    title: string;
    yearsOfExperience: number;
    education: Array<Education>;
    licenses: Array<License>;
  }
): Promise<boolean> => {
  try {
    await axios.post(
      `${base_url}/counsellor/update_professional_info.php`,
      {
        counsellorId,
        ...professionalInfo,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating professional info:", error);
    return false;
  }
};

export const updatePricing = async (
  counsellorId: string,
  rates: Array<PricingItem>
): Promise<boolean> => {
  try {
    await axios.post(
      `${base_url}/counsellor/update_pricing.php`,
      {
        counsellorId,
        rates,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating pricing:", error);
    return false;
  }
};

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
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating communication modes:", error);
    return false;
  }
};

export const updateSchedule = async (
  counsellorId: string,
  weeklySchedule: Array<ScheduleItem>
): Promise<boolean> => {
  try {
    await axios.post(
      `${base_url}/counsellor/update_schedule.php`,
      {
        counsellorId,
        weeklySchedule,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating schedule:", error);
    return false;
  }
};

export const updateLanguages = async (
  counsellorId: string,
  languages: Array<Language>
): Promise<boolean> => {
  try {
    await axios.post(
      `${base_url}/counsellor/update_languages.php`,
      {
        counsellorId,
        languages,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating languages:", error);
    return false;
  }
};

export const updateSpecialties = async (
  counsellorId: string,
  specialties: string[]
): Promise<boolean> => {
  try {
    await axios.post(
      `${base_url}/counsellor/update_specialties.php`,
      {
        counsellorId,
        specialties,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return true;
  } catch (error) {
    console.error("Error updating specialties:", error);
    return false;
  }
};

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

export const updateVerification = async (
  counsellorId: string,
  verificationData: {
    isVerified: boolean;
    documentsVerified: boolean;
    backgroundCheckDate: string;
  }
): Promise<boolean> => {
  try {
    await axios.post(
      `${base_url}/counsellor/update_verification.php`,
      {
        counsellorId,
        ...verificationData,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

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
};

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
};

export const returnAppointmentCounsellors = async () => {
  try {
    const response = await axios.get(
      `${base_url}/counsellor/get_counsellors_all.php`
    );
    const counsellorsList = response.data.counsellors;
    let result: Array<{ label: string; value: string; profilepic: string }> =
      [];
    counsellorsList.forEach((counsellor: any) => {
      result.push({
        label: counsellor.personalInfo.name,
        value: counsellor.id,
        profilepic: counsellor.personalInfo.profileImage,
      });
    });

    return result;
  } catch (error) {
    console.error("Error getting counsellors:", error);
    return [];
  }
};

export async function UpdateProfileImg(id: string, img: File): Promise<boolean> {
  try {
    const data = new FormData();
    data.append("ID", id);
    data.append("file", img);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${base_url}/counsellor/update_profile_pic.php`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    await axios.request(config);
    return true;
  } catch (error) {
    console.error("Error updating profile image:", error);
    return false;
  }
}

export async function UpdateBranches(
  counsellorId: string,
  primaryAddress: BranchType,
  preferredCenterAddress: BranchType
): Promise<boolean> {
  try {
    await axios.post(`${base_url}/counsellor/update_location.php`, {
      counsellorId,
      primaryAddress,
      preferredCenterAddress,
    });
    return true;
  } catch (error) {
    console.error("Error updating branches:", error);
    return false;
  }
}