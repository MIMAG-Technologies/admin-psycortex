"use client";

import { useLoading } from "@/context/LoadingContext";
import {
  getAllPaymentRecords,
  getOneCounsellorOverview,
  getRefreredTests,
} from "@/utils/payments";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaVideo,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaUserCircle,
  FaCommentDots,
  FaPhone,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdAttachMoney, MdPayment } from "react-icons/md";
type BasePaymentRecord = {
  id: string;
  order_id: string;
  tracking_id: string;
  bank_ref_no: string;
  date_time: string;
  payment_mode: string;
  amount: string;
  raw_amount: number;
  status: string;
  error_message: string;
  currency: string;
  billing_info: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
  };
  user_name: string;
  payment_type: string;
};

type TestPaymentRecords = {
  booking_id: string;
  user: {
    id: string;
    name: string;
  };
  test: {
    slug: string;
    name: string;
  };
  purchase_date: string;
  payment: {
    amount: string;
    currency: string;
    mode: string;
    transaction_id: string;
    status: string;
  };
};

type AppointmentPaymentRecords = BasePaymentRecord & {
  counsellor_name: string;
  meta: {
    user_id: string;
    counsellor_id: string;
    session_time: string;
    session_type: string;
  };
};

// 📌 Appointment Earnings Card
const AppointmentEarningsCard = ({
  record,
}: {
  record: AppointmentPaymentRecords;
}) => {
  const counsellorEarning = (record.raw_amount * 0.8).toFixed(2); // 80% of payment
  return (
    <div className="border bg-slate-100 border-slate-300  rounded-lg p-6   w-full mb-6">
      <h3 className="text-xl font-bold text-indigo-600">
        {record.counsellor_name}
      </h3>
      <p className="text-sm text-gray-500">{record.date_time}</p>

      <div className="mt-4 space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-indigo-500" />
          <span>
            <strong>Session Date:</strong> {record.meta.session_time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MdPayment className="text-indigo-500" />
          <span>
            <strong>Payment Mode:</strong> {record.payment_mode}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaUser className="text-indigo-500" />
          <span>
            <strong>Session Of:</strong> {record.user_name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-indigo-500" />
          <span>
            <strong>Location:</strong> {record.billing_info.city},{" "}
            {record.billing_info.state}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaVideo className="text-indigo-500" />
          <span>
            <strong>Mode:</strong> {record.meta.session_type}
          </span>
        </div>
      </div>

      <div className="mt-5 text-lg font-semibold text-gray-800">
        <div className="flex items-center gap-2 text-blue-600">
          <FaMoneyBillWave className="text-blue-600 text-lg" />
          <span>
            <strong>Payment Done:</strong> {record.amount}
          </span>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <MdAttachMoney className="text-green-600 text-lg" />
          <span>
            <strong>Counsellor Earned:</strong> INR {counsellorEarning}
          </span>
        </div>
      </div>
    </div>
  );
};

// 📌 Test Earnings Card
const TestEarningsCard = ({ record }: { record: TestPaymentRecords }) => {
  const counsellorEarning = (0.1 * parseFloat(record.payment.amount)).toFixed(2); 
  return (
    <div className="border bg-slate-100 border-slate-300  rounded-lg p-6   w-full mb-6">
      <h3 className="text-xl font-bold text-indigo-600">{record.test.name}</h3>
      <p className="text-sm text-gray-500">{record.purchase_date}</p>

      <div className="mt-4 space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <MdPayment className="text-indigo-500" />
          <span>
            <strong>Payment Mode:</strong> {record.payment.mode}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaUser className="text-indigo-500" />
          <span>
            <strong>Referred To:</strong> {record.user.name}
          </span>
        </div>
      </div>

      <div className="mt-5 text-lg font-semibold text-gray-800">
        <div className="flex items-center gap-2 text-blue-600">
          <FaMoneyBillWave className="text-blue-600 text-lg" />
          <span>
            <strong>Payment Done:</strong> {record.payment.amount} {record.payment.currency}
          </span>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <MdAttachMoney className="text-green-600 text-lg" />
          <span>
            <strong>Counsellor Earned:</strong> INR {counsellorEarning}
          </span>
        </div>
      </div>
    </div>
  );
};

type SimplifiedCounsellor = null | {
  id: string;
  personalInfo: {
    name: string;
    profileImage: string;
  };
  professionalInfo: {
    title: string;
    yearsOfExperience: number;
  };
  sessionCounts: {
    video: number;
    chat: number;
    phone: number;
    offline: number;
    total: number;
  };
  testReferrals: number;
  earnings: {
    video: string;
    chat: string;
    phone: string;
    offline: string;
    testRecommendation: string;
    total: string;
  };
};

// 📌 Earnings Overview Card

const EarningsOverview = ({ data }: { data: SimplifiedCounsellor }) => {
  if (!data) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 w-full mb-6">
      {/* Header Section */}
      <div className="flex items-center gap-4 border-b pb-4">
        <img
          src={data.personalInfo.profileImage}
          alt={data.personalInfo.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
        />
        <div>
          <h3 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <FaUserCircle className="text-indigo-500" />{" "}
            {data.personalInfo.name}
          </h3>
          <p className="text-lg text-gray-600">
            {data.professionalInfo.title} •{" "}
            {data.professionalInfo.yearsOfExperience} years
          </p>
        </div>
      </div>

      {/* Sessions Overview */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaCalendarAlt className="text-indigo-500" /> Sessions Overview
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-indigo-100 p-3 rounded-md flex items-center gap-2">
            <FaVideo className="text-indigo-600 text-lg" />
            <span>
              <strong>{data.sessionCounts.video}</strong> Video
            </span>
          </div>
          <div className="bg-blue-100 p-3 rounded-md flex items-center gap-2">
            <FaCommentDots className="text-blue-600 text-lg" />
            <span>
              <strong>{data.sessionCounts.chat}</strong> Chat
            </span>
          </div>
          <div className="bg-green-100 p-3 rounded-md flex items-center gap-2">
            <FaPhone className="text-green-600 text-lg" />
            <span>
              <strong>{data.sessionCounts.phone}</strong> Phone
            </span>
          </div>
          <div className="bg-gray-100 p-3 rounded-md flex items-center gap-2">
            <FaUser className="text-gray-600 text-lg" />
            <span>
              <strong>{data.sessionCounts.offline}</strong> Offline
            </span>
          </div>
        </div>
        <div className="mt-3 text-lg font-semibold text-gray-700">
          <strong>Total Sessions:</strong> {data.sessionCounts.total}
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaMoneyBillWave className="text-green-600" /> Earnings Overview
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-indigo-100 p-3 rounded-md flex items-center gap-2">
            <MdAttachMoney className="text-indigo-600 text-lg" />
            <span>₹{data.earnings.video} Video</span>
          </div>
          <div className="bg-blue-100 p-3 rounded-md flex items-center gap-2">
            <MdAttachMoney className="text-blue-600 text-lg" />
            <span>₹{data.earnings.chat} Chat</span>
          </div>
          <div className="bg-green-100 p-3 rounded-md flex items-center gap-2">
            <MdAttachMoney className="text-green-600 text-lg" />
            <span>₹{data.earnings.phone} Phone</span>
          </div>
          <div className="bg-yellow-100 p-3 rounded-md flex items-center gap-2">
            <MdAttachMoney className="text-yellow-600 text-lg" />
            <span>₹{data.earnings.testRecommendation} Test Referrals</span>
          </div>
        </div>
        <div className="mt-3 text-xl font-semibold text-green-700 flex items-center gap-2">
          <MdAttachMoney className="text-green-700 text-2xl" />
          <span>Total Earnings: ₹{data.earnings.total}</span>
        </div>
      </div>
    </div>
  );
};

// 📌 Main Component for fetching and displaying earnings
export default function OneCounsellorEarnings() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [testRecords, setTestRecords] = useState<Array<TestPaymentRecords>>([]);
  const [appointmentRecords, setAppointmentRecords] = useState<
    Array<AppointmentPaymentRecords>
  >([]);
  const [earningOverview, setearningOverview] =
    useState<SimplifiedCounsellor>(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_results: 1,
    results_per_page: 10,
  });
  const { setLoading } = useLoading();

  const fetchCounsellotPaymentRecords = async (page: number) => {
    if (!id) {
      return;
    }
    setLoading(true);
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(currentDate.getFullYear() + 5);
    const res = await getAllPaymentRecords(
      "appointment",
      id,
      page,
      "",
      "2025-01-01",
      futureDate.toISOString().split("T")[0]
    );
    setPagination(res.pagination);
    setAppointmentRecords(res.payment_records);

    const overviewdata = await getOneCounsellorOverview(id);
    setearningOverview(overviewdata);

    const testdata = await getRefreredTests(id);
    setTestRecords(testdata);
    setLoading(false);
  };

  useEffect(() => {
    fetchCounsellotPaymentRecords(pagination.current_page);
  }, [pagination.current_page]);

  return (
    <div className="p-8 mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Counsellor Earnings
      </h2>

      <EarningsOverview data={earningOverview} />

      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Appointment Earnings
        </h3>
        {appointmentRecords.length > 0 ? (
          appointmentRecords.map((record) => (
        <AppointmentEarningsCard key={record.id} record={record} />
          ))
        ) : (
          <p className="text-gray-500">No appointment records available.</p>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Test Recommendation Earnings
        </h3>
        {testRecords.length > 0 ? (
          testRecords.map((record) => (
        <TestEarningsCard key={record.booking_id} record={record} />
          ))
        ) : (
          <p className="text-gray-500">No test recommendation records available.</p>
        )}
      </div>
    </div>
  );
}
