import React, { useState } from "react";
import {
  IoEye,
  IoPencil,
  IoTrash,
  IoChatbubble,
  IoCall,
  IoVideocam,
  IoPerson,
  IoStatsChart,
} from "react-icons/io5";
import UpdateMetricsModal from "@/components/Counsellors/UpdateMetricsModal";

interface Counsellor {
  id: string;
  personalInfo: {
    name: string;
    profileImage: string;
  };
  professionalInfo: {
    title: string;
    yearsOfExperience: number;
  };
  practiceInfo: {
    specialties: string[];
    languages: { language: string }[];
  };
  sessionInfo: {
    availability: {
      communicationModes: string[];
    };
    pricing: {
      currency: string;
      rates: { sessionType: string; price: number }[];
    };
  };
  rating: {
    average: number;
  };
}

export default function CounsellorCard({
  counsellor,
  onViewProfile,
  onEdit,
  onDeactivate,
}: {
  counsellor: Counsellor;
  onViewProfile: (id: string) => void;
  onEdit: (id: string) => void;
  onDeactivate: (id: string) => void;
}) {
  const { name, profileImage } = counsellor.personalInfo;
  const { title, yearsOfExperience } = counsellor.professionalInfo;
  const { specialties, languages } = counsellor.practiceInfo;
  const { communicationModes } = counsellor.sessionInfo.availability;

  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  // Define available communication modes with icons
  const communicationIcons = [
    { mode: "chat", icon: <IoChatbubble size={20} />, color: "text-blue-500" },
    { mode: "call", icon: <IoCall size={20} />, color: "text-green-500" },
    { mode: "video", icon: <IoVideocam size={20} />, color: "text-purple-500" },
    {
      mode: "in_person",
      icon: <IoPerson size={20} />,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="border bg-slate-100 border-slate-300 rounded-lg p-5 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition">
      {/* Profile Image */}
      <img
        src={profileImage || "/images/user-dummy-img.png"}
        alt={name}
        className="w-20 h-20 rounded-full object-cover border border-gray-300"
      />

      {/* Counsellor Details */}
      <div className="flex-1 space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">
          {name} <span className="text-gray-500">({title})</span>
        </h2>
        <p className="text-sm text-gray-600">
          Experience:{" "}
          <span className="font-medium">{yearsOfExperience} years</span>
        </p>
        <p className="text-sm text-gray-600">
          Specialties:{" "}
          <span className="font-medium">
            {specialties.slice(0, 2).join(", ")}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Languages:{" "}
          <span className="font-medium">
            {languages.map((lang) => lang.language).join(", ")}
          </span>
        </p>

        {/* Communication Modes */}
        <div className="flex gap-2 mt-2">
          {communicationIcons.map(({ mode, icon, color }) => (
            <span
              key={mode}
              className={`${
                communicationModes.includes(mode) ? color : "text-gray-300"
              } transition`}
              title={mode.charAt(0).toUpperCase() + mode.slice(1)}
            >
              {icon}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onViewProfile(counsellor.id)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <IoEye className="text-blue-600" size={18} />
          View Profile
        </button>

        <button
          onClick={() => onEdit(counsellor.id)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <IoPencil className="text-gray-700" size={18} />
          Edit
        </button>

        <button
          onClick={() => onDeactivate(counsellor.id)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <IoTrash className="text-red-600" size={18} />
          Deactivate
        </button>

        <button
          onClick={() => setIsMetricsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <IoStatsChart className="text-indigo-600" size={18} />
          Edit Metrics
        </button>
      </div>

      {/* Update Metrics Modal */}
      <UpdateMetricsModal
        isOpen={isMetricsModalOpen}
        onClose={() => setIsMetricsModalOpen(false)}
        counsellorId={counsellor.id}
      />
    </div>
  );
}
