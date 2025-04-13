import axios from "axios";
import { getCounsellor, getCounsellors } from "./counsellor";
import { toast } from "react-toastify";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllCounsellorOverview = async () => {
  let res = [];
  try {
    const counsellors = await getCounsellors();

    for (const counsellor of counsellors) {

      const simplifiedCounsellor = {
        id: counsellor.id,
        personalInfo: {
          name: counsellor.personalInfo.name,
          profileImage: counsellor.personalInfo.profileImage,
        },
        professionalInfo: {
          title: counsellor.professionalInfo.title,
          yearsOfExperience: counsellor.professionalInfo.yearsOfExperience,
        },
      };
      res.push(simplifiedCounsellor);
    }

    return res;
  } catch (error) {
    console.error("Error getting counsellor overview:", error);
    return [];
  }
};

export const getOneCounsellorOverview = async (counsellorId: string) => {
  try {
    const counsellor = await getCounsellor(counsellorId);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split("T")[0];

    const overview = await axios.get(
      base_url +
        `/counsellor/get_counsellors_work.php?counsellorId=${counsellor.id}&filter=custom&startDate=2025-01-01&endDate=${formattedTomorrow}`
    );
    const res = {
      id: counsellorId,
      personalInfo: {
        name: counsellor.personalInfo.name,
        profileImage: counsellor.personalInfo.profileImage,
      },
      professionalInfo: {
        title: counsellor.professionalInfo.title,
        yearsOfExperience: counsellor.professionalInfo.yearsOfExperience,
      },
      sessionCounts: overview.data.sessionCounts,
      testReferrals: overview.data.testReferrals,
      earnings: overview.data.earnings,
    };
    return res;
  } catch (error) {
    console.error("Error getting one counsellor overview:", error);
    return null;
  }
};

export const getAllPaymentRecords = async (
  payment_type: "appointment" | "test",
  counsellorId: string,
  page: number = 1,
  type?: string | null,
  from?: string | null,
  to?: string | null
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

    const responce = await axios.get(
      `${base_url}/admin/get_payment_records.php?type=${type}&counsellorId=${counsellorId}&from=${from}&to=${to}&payment_type=${payment_type}&page=${page}`,
      { headers }
    );

    return {
      payment_records: responce.data.payment_records,
      pagination: responce.data.pagination,
    };
  } catch (error) {
    console.error("Error getting payment records:", error);
    return {
      payment_records: [],
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_results: 1,
        results_per_page: 20,
      },
    };
  }
};

export const getRefreredTests = async(counsellor_id:string)=>{
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

    const responce = await axios.get(
      `${base_url}/counsellor/get_referred_test.php?counsellorId=${counsellor_id}`,
    );

    return responce.data.referred_tests;
  } catch (error) {
    console.error("Error getting referred tests:", error);
    return null;
  }
};


