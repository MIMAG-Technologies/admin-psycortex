"use client";

import { useEffect, useState } from "react";
import ApplicationCard from "@/components/Counsellors/ApplicationCard";
import ViewApplicationModal from "@/components/Counsellors/ViewApplicationModal";
import VerifyApplicationModal from "@/components/Counsellors/VerifyApplicationModal";

// Simulated API fetch function
const fetchApplications = async () => {
  return [
    {
      id: "c101",
      personalInfo: {
        name: "Dr. Rohan Mehta",
        dateOfBirth: "1985-06-20",
        gender: "Male",
        profileImage: "https://randomuser.me/api/portraits/men/20.jpg",
        email: "rohan.mehta@example.com",
        phone: "+91 9876543210",
      },
      professionalInfo: {
        title: "Clinical Psychologist",
        yearsOfExperience: 10,
      },
      practiceInfo: {
        specialties: ["Depression", "Stress Management"],
        languages: [{ language: "English" }, { language: "Hindi" }],
      },
    },
    {
      id: "c102",
      personalInfo: {
        name: "Dr. Neha Sharma",
        dateOfBirth: "1990-08-12",
        gender: "Female",
        profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
        email: "neha.sharma@example.com",
        phone: "+91 9876543211",
      },
      professionalInfo: {
        title: "Behavioral Therapist",
        yearsOfExperience: 7,
      },
      practiceInfo: {
        specialties: ["Child Counseling", "Cognitive Therapy"],
        languages: [{ language: "English" }, { language: "Marathi" }],
      },
    },
    {
      id: "c103",
      personalInfo: {
        name: "Dr. Rajiv Kapoor",
        dateOfBirth: "1982-12-05",
        gender: "Male",
        profileImage: "https://randomuser.me/api/portraits/men/35.jpg",
        email: "rajiv.kapoor@example.com",
        phone: "+91 9876543212",
      },
      professionalInfo: {
        title: "Mental Health Specialist",
        yearsOfExperience: 15,
      },
      practiceInfo: {
        specialties: ["Anxiety", "Trauma Recovery"],
        languages: [{ language: "Hindi" }, { language: "English" }],
      },
    },
  ];
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // Fetch applications (simulate API call)
  useEffect(() => {
    const loadApplications = async () => {
      const data = await fetchApplications();
      setApplications(data);
    };
    loadApplications();
  }, []);

  // Handlers for actions
  const handleViewApplication = (id: string) => {
    const selected = applications.find((app) => app.id === id);
    if (selected) {
      setSelectedApplication(selected);
      setViewModalOpen(true);
    }
  };

  const handleVerify = (id: string) => {
    const selected = applications.find((app) => app.id === id);
    if (selected) {
      setSelectedApplication(selected);
      setVerifyModalOpen(true);
    }
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Counsellor Applications
      </h1>

      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            id={application.id}
            name={application.personalInfo.name}
            dateOfBirth={application.personalInfo.dateOfBirth}
            gender={application.personalInfo.gender}
            profileImage={application.personalInfo.profileImage}
            title={application.professionalInfo.title}
            onViewApplication={handleViewApplication}
            onVerify={handleVerify}
          />
        ))}
      </div>

      {/* View Application Modal */}
      <ViewApplicationModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        counsellor={selectedApplication}
        onVerify={handleVerify}
      />

      {/* Verify Application Modal */}
      <VerifyApplicationModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        onVerify={() => alert("Application Verified")}
        counsellorEmail={selectedApplication?.personalInfo.email || ""}
      />
    </div>
  );
}
