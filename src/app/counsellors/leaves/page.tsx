"use client";

import { useEffect, useState } from "react";
import LeaveApplication from "@/components/Counsellors/LeaveApplication";
import { GetLeaves } from "@/utils/counsellor";

export default function LeavesPage() {
  const [leaveApplications, setLeaveApplications] = useState<
    Array<{
      id: number;
      counsellor_id: string;
      counsellor_name: string;
      date: string;
      time_slot: string;
      leave_reason: string;
      leave_until: string | null;
    }>
  >([]);
  // Fetch leave applications
  useEffect(() => {
    const loadLeaves = async () => {
      const data = await GetLeaves();
      setLeaveApplications(data);
    };
    loadLeaves();
  }, []);


  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Leave Applications
      </h1>

      <div className="space-y-4">
        {leaveApplications.map((application) => (
          <LeaveApplication
            key={application.id}
            id={application.id}
            name={application.counsellor_name}
            leaveStart={application.time_slot}
            message={application.leave_reason}
            leaveTill={application.leave_until}
          />

          // { id, name, title, profilePhoto, leaveTill, leaveStart, message, onViewApplication
        ))}
      </div>
    </div>
  );
}
