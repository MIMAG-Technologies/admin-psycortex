"use client";

import { useState } from "react";
import LeaveApplication from "@/components/Counsellors/LeaveApplication";

export default function LeavesPage() {
  const [leaveApplications, setLeaveApplications] = useState([
    {
      id: "l123",
      name: "Dr. Sarah Johnson",
      title: "Clinical Psychologist",
      profilePhoto:
        "https://backend.psycortex.in/profile/counsellor/c123456.png",
      leaveTill: "2024-05-10",
      message: "I need leave due to personal reasons and will be back soon.",
    },
    {
      id: "l124",
      name: "Dr. Aryan Sharma",
      title: "Mental Health Specialist",
      profilePhoto:
        "https://backend.psycortex.in/profile/counsellor/c1740577404577.png",
      leaveTill: "2024-06-01",
      message:
        "Attending an international psychology seminar. Requesting leave for professional development.",
    },
    {
      id: "l125",
      name: "Dr. Priya Kapoor",
      title: "Behavioral Therapist",
      profilePhoto: "https://randomuser.me/api/portraits/women/75.jpg",
      leaveTill: "2024-04-25",
      message:
        "I have a medical emergency and will be unavailable for the next few days.",
    },
    {
      id: "l126",
      name: "Dr. Rahul Mehta",
      title: "Child Psychologist",
      profilePhoto: "https://randomuser.me/api/portraits/men/75.jpg",
      leaveTill: "2024-07-15",
      message:
        "Taking time off for family vacation. Will resume work as scheduled.",
    },
  ]);

  // Handlers for actions
  const handleViewApplication = (id: string) => {
    console.log("View Leave Application:", id);
  };

  const handleVerify = (id: string) => {
    console.log("Verify Leave Application:", id);
  };

  return (
    <div className=" mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Leave Applications
      </h1>

      {/* List of Leave Applications */}
      <div className="space-y-4">
        {leaveApplications.map((application) => (
          <LeaveApplication
            key={application.id}
            id={application.id}
            name={application.name}
            title={application.title}
            profilePhoto={application.profilePhoto}
            leaveTill={application.leaveTill}
            message={application.message}
            onViewApplication={handleViewApplication}
            onVerify={handleVerify}
          />
        ))}
      </div>
    </div>
  );
}
