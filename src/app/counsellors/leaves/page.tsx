"use client";

import { useEffect, useState } from "react";
import LeaveApplication from "@/components/Counsellors/LeaveApplication";
import { GetLeaves } from "@/utils/counsellor";
import { useLoading } from "@/context/LoadingContext";

export default function LeavesPage() {
  const [leaveApplications, setLeaveApplications] = useState<
    Array<{
      id: number;
      counsellor_id: string;
      counsellor_name: string;
      type: string;
      start_date: string;
      end_date: string;
      time_slot: string;
      leave_reason: string;
    }>
  >([]);
  const { setLoading } = useLoading();
  const [month, setMonth] = useState(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  });

  // Generate options for the dropdown (current year, 01 to 12)
  const generateMonthOptions = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0");
      const monthName = new Date(year, i).toLocaleString("default", {
        month: "long",
      });
      return {
        value: `${year}-${month}`,
        label: `${monthName} ${year}`,
      };
    });
    return months;
  };

  // Fetch leave applications
  useEffect(() => {
    const loadLeaves = async () => {
      setLoading(true);
      const data = await GetLeaves(month);
      setLeaveApplications(data);
      setLoading(false);
    };
    loadLeaves();
  }, [month]);

  return (
    <div className="mx-auto p-6">

      {/* Filter Section */}
      <div className="mb-8 flex justify-around w-full items-center">
      <h1 className="text-3xl font-semibold text-gray-900 text-center">
        Leave Applications
      </h1>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-fit"
        >
          {generateMonthOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {leaveApplications.length > 0 ? (
          leaveApplications.map((application) => (
            <LeaveApplication
              key={application.id}
              name={application.counsellor_name}
              leaveStart={application.start_date}
              message={application.leave_reason}
              leaveTill={application.end_date}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No leave applications found for {month}.
          </p>
        )}
      </div>
    </div>
  );
}
