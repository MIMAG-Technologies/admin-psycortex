import axios from "axios";
import { getCounsellors } from "./counsellor";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

const getAllCounsellorOverview = async () => {
  let res = [];
  try {
    const counsellors = await getCounsellors();

    for (const counsellor of counsellors) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedTomorrow = tomorrow.toISOString().split("T")[0];

      const overview = await axios.get(
        base_url +
          `/counsellor/get_counsellors_work.php?counsellorId=${counsellor.id}&filter=custom&startDate=2025-01-01&endDate=${formattedTomorrow}`
      );

      // Extract only the needed fields from counsellor and overview
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
        sessionCounts: overview.data.sessionCounts,
        testReferrals: overview.data.testReferrals,
        earnings: overview.data.earnings,
      };
      res.push(simplifiedCounsellor);
    }

    return res;
  } catch (error) {
    console.error("Error getting counsellor overview:", error);
    return [];
  }
};

export const getAllPaymentRecords = async (
  payment_type: "appointment" | "test",
  type?: string,
  counsellorId?: string,
  from?: string,
  to?: string
) => {
  try {
    const responce = await axios.get(
      `${base_url}/admin/get_payment_records.php?type=${type}&counsellorId=${counsellorId}&from=${from}&to=${to}&payment_type=${payment_type}`
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

export default getAllCounsellorOverview;
