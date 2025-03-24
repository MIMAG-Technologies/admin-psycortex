"use client";

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

type TestPaymentRecords = BasePaymentRecord & {
  test_name: string;
  referred_by: string | null;
  meta: {
    user_id: string;
    test_slug: string;
    counsellor_id: string | null;
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
  const counsellorEarning = (record.raw_amount * 0.1).toFixed(2); // 10% of payment
  return (
    <div className="border bg-slate-100 border-slate-300  rounded-lg p-6   w-full mb-6">
      <h3 className="text-xl font-bold text-indigo-600">{record.test_name}</h3>
      <p className="text-sm text-gray-500">{record.date_time}</p>

      <div className="mt-4 space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <MdPayment className="text-indigo-500" />
          <span>
            <strong>Payment Mode:</strong> {record.payment_mode}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaUser className="text-indigo-500" />
          <span>
            <strong>Referred To:</strong> {record.user_name}
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

type SimplifiedCounsellor = null |  {
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
  const [earningOverview, setearningOverview] = useState<SimplifiedCounsellor>(null)

  useEffect(() => {
    if (!id) return;

 const testRecords: TestPaymentRecords[] = [
   {
     id: "pay_17409117726074",
     order_id: "order_1740911685057",
     tracking_id: "113668327108",
     bank_ref_no: "542756938148",
     date_time: "2025-03-03 16:05:12",
     payment_mode: "Credit Card",
     amount: "INR 2.00",
     raw_amount: 2,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "John Doe",
       address: "Test Address",
       city: "Mumbai",
       state: "Maharashtra",
       zip: "400001",
       country: "India",
       phone: "912345678901",
       email: "johndoe@example.com",
     },
     user_name: "John Doe",
     payment_type: "test",
     test_name: "Mental Health Test",
     referred_by: null,
     meta: {
       user_id: "7FINihOcYidB1rfajTdoNAFnTDC4",
       test_slug: "mental-health",
       counsellor_id: "counsellor_123",
     },
   },
   {
     id: "pay_17409117726075",
     order_id: "order_1740911685058",
     tracking_id: "113668327109",
     bank_ref_no: "542756938149",
     date_time: "2025-03-04 16:05:12",
     payment_mode: "Debit Card",
     amount: "INR 3.00",
     raw_amount: 3,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "Jane Smith",
       address: "Another Address",
       city: "Pune",
       state: "Maharashtra",
       zip: "411001",
       country: "India",
       phone: "919876543210",
       email: "janesmith@example.com",
     },
     user_name: "Jane Smith",
     payment_type: "test",
     test_name: "Physical Fitness Test",
     referred_by: null,
     meta: {
       user_id: "8FINihOcYidB1rfajTdoNAFnTDC5",
       test_slug: "physical-fitness",
       counsellor_id: "counsellor_123",
     },
   },
   {
     id: "pay_17409117726076",
     order_id: "order_1740911685059",
     tracking_id: "113668327110",
     bank_ref_no: "542756938150",
     date_time: "2025-03-05 16:05:12",
     payment_mode: "Net Banking",
     amount: "INR 4.00",
     raw_amount: 4,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "Alice Johnson",
       address: "Some Address",
       city: "Nagpur",
       state: "Maharashtra",
       zip: "440001",
       country: "India",
       phone: "911234567890",
       email: "alicejohnson@example.com",
     },
     user_name: "Alice Johnson",
     payment_type: "test",
     test_name: "Emotional Intelligence Test",
     referred_by: null,
     meta: {
       user_id: "9FINihOcYidB1rfajTdoNAFnTDC6",
       test_slug: "emotional-intelligence",
       counsellor_id: "counsellor_123",
     },
   },
   {
     id: "pay_17409117726077",
     order_id: "order_1740911685060",
     tracking_id: "113668327111",
     bank_ref_no: "542756938151",
     date_time: "2025-03-06 16:05:12",
     payment_mode: "UPI",
     amount: "INR 5.00",
     raw_amount: 5,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "Bob Brown",
       address: "Yet Another Address",
       city: "Aurangabad",
       state: "Maharashtra",
       zip: "431001",
       country: "India",
       phone: "910987654321",
       email: "bobbrown@example.com",
     },
     user_name: "Bob Brown",
     payment_type: "test",
     test_name: "Cognitive Skills Test",
     referred_by: null,
     meta: {
       user_id: "10FINihOcYidB1rfajTdoNAFnTDC7",
       test_slug: "cognitive-skills",
       counsellor_id: "counsellor_123",
     },
   },
 ];
 setTestRecords(testRecords);
 const paymentRecords: AppointmentPaymentRecords[] = [
   {
     id: "pay_17422748827222",
     order_id: "order_1742274714297",
     tracking_id: "113686871200",
     bank_ref_no: "123456789",
     date_time: "2025-03-18 10:41:59",
     payment_mode: "Unified Payments",
     amount: "INR 1,048.95",
     raw_amount: 1048.95,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "Adarsh Nagrikar",
       address: "Test Address",
       city: "Test City",
       state: "Test State",
       zip: "PINCODE",
       country: "India",
       phone: "917620216605",
       email: "adarshnagrikar1404@gmail.com",
     },
     user_name: "Adarsh Nagrikar",
     payment_type: "appointment",
     counsellor_name: "Dr. Sarah Johnson",
     meta: {
       user_id: "6FINihOcYidB1rfajTdoNAFnTDC3",
       counsellor_id: "c123456",
       session_time: "2025-02-23 18:43:00",
       session_type: "video",
     },
   },
   {
     id: "pay_17422748827223",
     order_id: "order_1742274714298",
     tracking_id: "113686871201",
     bank_ref_no: "987654321",
     date_time: "2025-03-19 11:00:00",
     payment_mode: "Credit Card",
     amount: "INR 2,000.00",
     raw_amount: 2000.0,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "John Doe",
       address: "Another Address",
       city: "Another City",
       state: "Another State",
       zip: "123456",
       country: "India",
       phone: "912345678901",
       email: "johndoe@example.com",
     },
     user_name: "John Doe",
     payment_type: "appointment",
     counsellor_name: "Dr. Sarah Johnson",
     meta: {
       user_id: "7FINihOcYidB1rfajTdoNAFnTDC4",
       counsellor_id: "c123456",
       session_time: "2025-02-24 19:00:00",
       session_type: "audio",
     },
   },
   {
     id: "pay_17422748827224",
     order_id: "order_1742274714299",
     tracking_id: "113686871202",
     bank_ref_no: "456789123",
     date_time: "2025-03-20 12:00:00",
     payment_mode: "Debit Card",
     amount: "INR 1,500.00",
     raw_amount: 1500.0,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "Jane Smith",
       address: "Some Address",
       city: "Some City",
       state: "Some State",
       zip: "654321",
       country: "India",
       phone: "919876543210",
       email: "janesmith@example.com",
     },
     user_name: "Jane Smith",
     payment_type: "appointment",
     counsellor_name: "Dr. Sarah Johnson",
     meta: {
       user_id: "8FINihOcYidB1rfajTdoNAFnTDC5",
       counsellor_id: "c123456",
       session_time: "2025-02-25 20:00:00",
       session_type: "chat",
     },
   },
   {
     id: "pay_17422748827225",
     order_id: "order_1742274714300",
     tracking_id: "113686871203",
     bank_ref_no: "321654987",
     date_time: "2025-03-21 13:00:00",
     payment_mode: "Net Banking",
     amount: "INR 3,000.00",
     raw_amount: 3000.0,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "Alice Johnson",
       address: "Another Address",
       city: "Another City",
       state: "Another State",
       zip: "789456",
       country: "India",
       phone: "911234567890",
       email: "alicejohnson@example.com",
     },
     user_name: "Alice Johnson",
     payment_type: "appointment",
     counsellor_name: "Dr. Sarah Johnson",
     meta: {
       user_id: "9FINihOcYidB1rfajTdoNAFnTDC6",
       counsellor_id: "c123456",
       session_time: "2025-02-26 21:00:00",
       session_type: "video",
     },
   },
   {
     id: "pay_17422748827226",
     order_id: "order_1742274714301",
     tracking_id: "113686871204",
     bank_ref_no: "654987321",
     date_time: "2025-03-22 14:00:00",
     payment_mode: "UPI",
     amount: "INR 2,500.00",
     raw_amount: 2500.0,
     status: "Success",
     error_message: "",
     currency: "INR",
     billing_info: {
       name: "Bob Brown",
       address: "Yet Another Address",
       city: "Yet Another City",
       state: "Yet Another State",
       zip: "987654",
       country: "India",
       phone: "910987654321",
       email: "bobbrown@example.com",
     },
     user_name: "Bob Brown",
     payment_type: "appointment",
     counsellor_name: "Dr. Sarah Johnson",
     meta: {
       user_id: "10FINihOcYidB1rfajTdoNAFnTDC7",
       counsellor_id: "c123456",
       session_time: "2025-02-27 22:00:00",
       session_type: "audio",
     },
   },
 ];

 setAppointmentRecords(paymentRecords);

 const overview = {
   id: "c123456",
   personalInfo: {
     name: "Dr. Sarah Johnson",
     profileImage:
       "https://backend.psycortex.in/profile/counsellor/c123456.png",
   },
   professionalInfo: {
     title: "Clinical Psychologist",
     yearsOfExperience: 12,
   },
   sessionCounts: {
     video: 3,
     chat: 3,
     phone: 1,
     offline: 0,
     total: 7,
   },
   testReferrals: 1,
   earnings: {
     video: "6300.00",
     chat: "2100.00",
     phone: "350.00",
     offline: "0.00",
     testRecommendation: "99.90",
     total: "8849.90",
   },
 };

 setearningOverview(overview);

  }, [id]);

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
        {appointmentRecords.map((record) => (
          <AppointmentEarningsCard key={record.id} record={record} />
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Test Recommendation Earnings
        </h3>
        {testRecords.map((record) => (
          <TestEarningsCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
