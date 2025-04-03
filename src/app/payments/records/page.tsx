"use client";

import { useEffect, useState } from "react";
import { getAllPaymentRecords } from "@/utils/payments";
import {
  FaMoneyBillWave,
  FaUser,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useLoading } from "@/context/LoadingContext";

export default function PaymentPage() {
  const [from, setFrom] = useState<string | null>("");
  const [to, setTo] = useState<string | null>("");
   const { setLoading } = useLoading();

  const [paymentType, setPaymentType] = useState<"appointment" | "test">(
    "appointment"
  );
  const [paymentRecords, setPaymentRecords] = useState<Array<any>>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_results: 1,
    results_per_page: 10,
  });

  useEffect(() => {
    fetchPayments(pagination.current_page);
  }, [from, to, paymentType, pagination.current_page]);

  const fetchPayments = async (page: number) => {
    setLoading(true);
    const res = await getAllPaymentRecords(paymentType, "",page, "", from, to, );
    setPagination(res.pagination);
    setPaymentRecords(res.payment_records);
    setLoading(false);
  };

  return (
    <div className="p-6 ">
      {/* Filter Section */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-md border">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Filter Payments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className=" text-sm font-medium mb-1 flex items-center gap-2">
              <FaCalendarAlt /> From Date
            </label>
            <input
              type="date"
              className="w-full p-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={from || ""}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            <label className=" text-sm font-medium mb-1 flex items-center gap-2">
              <FaCalendarAlt /> To Date
            </label>
            <input
              type="date"
              className="w-full p-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={to || ""}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div>
            <label className=" text-sm font-medium mb-1 flex items-center gap-2">
              <FaMoneyBillWave /> Payment Type
            </label>
            <select
              className="w-full p-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={paymentType}
              onChange={(e) =>
                setPaymentType(e.target.value as "appointment" | "test")
              }
            >
              <option value="appointment">Appointment</option>
              <option value="test">Test</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Records Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Payment Records
        </h2>
        {paymentRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border border-gray-300 p-3 text-left">ID</th>
                  <th className="border border-gray-300 p-3 text-left">Date</th>
                  <th className="border border-gray-300 p-3 text-left">
                    Amount
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Payment Mode
                  </th>
                  <th className="border border-gray-300 p-3 text-left">User</th>
                  {paymentType === "appointment" && (
                    <th className="border border-gray-300 p-3 text-left">
                      Counsellor
                    </th>
                  )}
                  {paymentType === "test" && (
                    <th className="border border-gray-300 p-3 text-left">
                      Test Name
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paymentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className="border border-gray-300 p-3">{record.id}</td>
                    <td className="border border-gray-300 p-3">
                      {record.date_time}
                    </td>
                    <td className="border border-gray-300 p-3 text-green-600 font-semibold">
                      ${record.amount}
                    </td>
                    <td
                      className={`border border-gray-300 p-3 capitalize font-medium ${
                        record.status === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {record.status}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {record.payment_mode}
                    </td>
                    <td className="border border-gray-300 p-3 flex items-center gap-2">
                      <FaUser className="text-blue-500" /> {record.user_name}
                    </td>
                    {paymentType === "appointment" && (
                      <td className="border border-gray-300 p-3">
                        {record.counsellor_name}
                      </td>
                    )}
                    {paymentType === "test" && (
                      <td className="border border-gray-300 p-3">
                        {record.test_name}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No payment records found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={pagination.current_page === 1}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              current_page: prev.current_page - 1,
            }))
          }
          className="px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50"
        >
          <FaArrowLeft /> Previous
        </button>
        <span className="text-gray-600">
          Page {pagination.current_page} of {pagination.total_pages}
        </span>
        <button
          disabled={pagination.current_page === pagination.total_pages}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              current_page: prev.current_page + 1,
            }))
          }
          className="px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50"
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
