"use client";

import { useEffect, useState } from "react";
import LeaveApplication from "@/components/Counsellors/LeaveApplication";
import ViewLeaveModal from "@/components/Counsellors/ViewLeaveModal";
import VerifyLeaveModal from "@/components/Counsellors/VerifyLeaveModal";

// Simulated API fetch function
const fetchLeaveApplications = async () => {
  return [
    {
      id: "l123",
      name: "Dr. Sarah Johnson",
      title: "Clinical Psychologist",
      profilePhoto: "https://randomuser.me/api/portraits/women/45.jpg",
      leaveTill: "2024-05-10",
      message: "I need leave due to personal reasons and will be back soon.",
    },
    {
      id: "l127",
      name: "Dr. Ananya Iyer",
      title: "Clinical Psychologist",
      profilePhoto: "https://randomuser.me/api/portraits/women/68.jpg",
      leaveTill: "2024-08-15",
      message:
        "I am requesting leave from my duties due to a combination of personal and professional reasons. Over the past few months, I have been working extensively with clients suffering from anxiety and depression, which has been both fulfilling and emotionally demanding. To ensure I maintain my mental well-being and continue providing the best possible care to my patients, I believe a short break is necessary. Additionally, I have been invited to attend a prestigious international conference on trauma therapy techniques, which will not only enhance my skills but also allow me to bring back valuable insights for our practice. I sincerely request approval for my leave until August 15th, and I assure you that I will coordinate with my clients to ensure a smooth transition during my absence. Please let me know if any further details are required.",
    },
    {
      id: "l124",
      name: "Dr. Aryan Sharma",
      title: "Mental Health Specialist",
      profilePhoto: "https://randomuser.me/api/portraits/men/30.jpg",
      leaveTill: "2024-06-01",
      message:
        "Attending an international psychology seminar. Requesting leave for professional development.",
    },
    {
      id: "l125",
      name: "Dr. Priya Kapoor",
      title: "Behavioral Therapist",
      profilePhoto: "https://randomuser.me/api/portraits/women/50.jpg",
      leaveTill: "2024-04-25",
      message:
        "I have a medical emergency and will be unavailable for the next few days.",
    },
    {
      id: "l126",
      name: "Dr. Rahul Mehta",
      title: "Child Psychologist",
      profilePhoto: "https://randomuser.me/api/portraits/men/60.jpg",
      leaveTill: "2024-07-15",
      message:
        "Taking time off for family vacation. Will resume work as scheduled.",
    },
  ];
};

export default function LeavesPage() {
  const [leaveApplications, setLeaveApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // Fetch leave applications (simulate API call)
  useEffect(() => {
    const loadLeaves = async () => {
      const data = await fetchLeaveApplications();
      setLeaveApplications(data);
    };
    loadLeaves();
  }, []);

  // Handlers for actions
  const handleViewApplication = (id: string) => {
    const selected = leaveApplications.find((app) => app.id === id);
    if (selected) {
      setSelectedApplication(selected);
      setViewModalOpen(true);
    }
  };

  const handleVerify = (id: string) => {
    const selected = leaveApplications.find((app) => app.id === id);
    if (selected) {
      setSelectedApplication(selected);
      setVerifyModalOpen(true);
    }
  };

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

      {/* View Leave Application Modal */}
      <ViewLeaveModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        application={selectedApplication}
        onVerify={handleVerify}
      />

      {/* Verify Leave Application Modal */}
      <VerifyLeaveModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        onConfirm={() => alert("Leave Approved")}
        counsellorName={selectedApplication?.name || ""}
      />
    </div>
  );
}
