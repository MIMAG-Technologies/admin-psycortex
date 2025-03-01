"use client";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";
import { useState } from "react";
import CounsellorCard from "@/components/Counsellors/CounsellorCard";
import { LuSettings2 } from "react-icons/lu";

export default function Page() {
  const [counsellors, setCounsellors] = useState([
    {
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
      practiceInfo: {
        specialties: [
          "Anxiety",
          "Depression",
          "Relationship Counseling",
          "Trauma",
        ],
        languages: [
          {
            language: "English",
            proficiencyLevel: "Native",
          },
          {
            language: "Spanish",
            proficiencyLevel: "Fluent",
          },
        ],
      },
      sessionInfo: {
        availability: {
          communicationModes: ["chat", "call"],
        },
        pricing: {
          currency: "INR",
          rates: [
            {
              sessionType: "1 Hr Chat",
              price: 1000,
              currency: "INR",
              typeOfAvailability: "chat",
              sessionTitle: "Comprehensive Counseling Session",
            },
            {
              sessionType: "1 Hr Session",
              price: 3000,
              currency: "INR",
              typeOfAvailability: "call",
              sessionTitle: "Quick Consultation",
            },
          ],
        },
      },
      rating: {
        average: 4.79999999999999982236431605997495353221893310546875,
      },
    },
    {
      id: "c1737566436590",
      personalInfo: {
        name: "Dr. Sarah Johnson",
        profileImage:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVxoJm4rg0bhATGRsn7c4SdecLsntvbFbspA&s",
      },
      professionalInfo: {
        title: "Clinical Psychologist",
        yearsOfExperience: 12,
      },
      practiceInfo: {
        specialties: [
          "Anxiety",
          "Depression",
          "Relationship Counseling",
          "Stress Management",
        ],
        languages: [
          {
            language: "English",
            proficiencyLevel: "Native",
          },
          {
            language: "Hindi",
            proficiencyLevel: "Native",
          },
        ],
      },
      sessionInfo: {
        availability: {
          communicationModes: ["chat", "call"],
        },
        pricing: {
          currency: "INR",
          rates: [
            {
              sessionType: "1 Hr Chat",
              price: 1000,
              currency: "INR",
              typeOfAvailability: "chat",
              sessionTitle: "Comprehensive Counseling Session",
            },
            {
              sessionType: "1 Hr Session",
              price: 2500,
              currency: "INR",
              typeOfAvailability: "call",
              sessionTitle: "Quick Consultation",
            },
          ],
        },
      },
      rating: {
        average: 4.25,
      },
    },
    {
      id: "c1740577404577",
      personalInfo: {
        name: "Dr. Aryan Sharma",
        profileImage:
          "https://backend.psycortex.in/profile/counsellor/c1740577404577.png",
      },
      professionalInfo: {
        title: "Clinical Psychologist",
        yearsOfExperience: 15,
      },
      practiceInfo: {
        specialties: ["Anxiety", "Career Counseling", "Stress Management"],
        languages: [
          {
            language: "English",
            proficiencyLevel: "Fluent",
          },
          {
            language: "Hindi",
            proficiencyLevel: "Native",
          },
          {
            language: "Marathi",
            proficiencyLevel: "Native",
          },
        ],
      },
      sessionInfo: {
        availability: {
          communicationModes: ["chat", "call", "video", "in_person"],
        },
        pricing: {
          currency: "INR",
          rates: [
            {
              sessionType: "1 Hr Chat",
              price: 1000,
              currency: "INR",
              typeOfAvailability: "chat",
              sessionTitle: "Comprehensive Counseling Session",
            },
            {
              sessionType: "1 Hr In-Person Session",
              price: 5000,
              currency: "INR",
              typeOfAvailability: "in_person",
              sessionTitle: "Face-to-Face Therapy Session",
            },
            {
              sessionType: "1 Hr Session",
              price: 3000,
              currency: "INR",
              typeOfAvailability: "call",
              sessionTitle: "Quick Consultation",
            },
            {
              sessionType: "1 Hr Video Session",
              price: 3500,
              currency: "INR",
              typeOfAvailability: "video",
              sessionTitle: "Personalized Video Consultation",
            },
          ],
        },
      },
      rating: {
        average: 0,
      },
    },
  ]);

  // Handlers for actions
  const handleViewProfile = (id: string) => {
    console.log("View Profile:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit Counsellor:", id);
  };

  const handleDeactivate = (id: string) => {
    console.log("Deactivate Counsellor:", id);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-4 border-slate-300 justify-center sm:justify-between">
        <h1 className="text-2xl w-full sm:w-fit font-bold text-gray-800 mr-auto text-center sm:text-left">
          Counsellors
        </h1>
        <Link
          href="#"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <LuSettings2 />
          Filters
        </Link>
        <Link
          href="/counsellors/create"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <BiPlus />
          Create Counsellor
        </Link>
      </div>

      <div className="space-y-4">
        {counsellors.map((counsellor) => (
          <CounsellorCard
            key={counsellor.id}
            counsellor={counsellor}
            onViewProfile={handleViewProfile}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
          />
        ))}
      </div>
    </div>
  );
}
