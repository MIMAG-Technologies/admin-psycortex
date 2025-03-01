"use client";

import { useState } from "react";
import ApplicationCard from "@/components/Counsellors/ApplicationCard";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([
    {
      id: "a123",
      name: "Dr. Sarah Johnson",
      dateOfBirth: "1985-04-15",
      gender: "Female",
      profileImage:
        "https://backend.psycortex.in/profile/counsellor/c123456.png",
      title: "Clinical Psychologist",
    },
    {
      id: "a124",
      name: "Dr. Aryan Sharma",
      dateOfBirth: "1980-07-10",
      gender: "Male",
      profileImage:
        "https://backend.psycortex.in/profile/counsellor/c1740577404577.png",
      title: "Mental Health Specialist",
    },
    {
      id: "a125",
      name: "Dr. Priya Kapoor",
      dateOfBirth: "1990-02-22",
      gender: "Female",
      profileImage: "https://randomuser.me/api/portraits/women/75.jpg",
      title: "Behavioral Therapist",
    },
    {
      id: "a126",
      name: "Dr. Rahul Mehta",
      dateOfBirth: "1978-11-30",
      gender: "Male",
      profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
      title: "Child Psychologist",
    },
  ]);

  // Handlers for actions
  const handleViewApplication = (id: string) => {
    console.log("View Application:", id);
  };

  const handleVerify = (id: string) => {
    console.log("Verify Application:", id);
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Counsellor Applications
      </h1>  


      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            id={application.id}
            name={application.name}
            dateOfBirth={application.dateOfBirth}
            gender={application.gender}
            profileImage={application.profileImage}
            title={application.title}
            onViewApplication={handleViewApplication}
            onVerify={handleVerify}
          />
        ))}
      </div>
    </div>
  );
}
