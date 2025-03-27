"use client";

import { useLoading } from "@/context/LoadingContext";
import { getCounsellor } from "@/utils/counsellor";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaPhone,
  FaUserCheck,
  FaStar,
  FaClock,
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle,
  FaGraduationCap,
  FaChartBar,
  FaCertificate,
  FaTag,
} from "react-icons/fa";
import { IoCall, IoChatbubble, IoPerson, IoVideocam } from "react-icons/io5";

interface Counsellor {
  id: string;
  personalInfo: {
    name: string;
    dateOfBirth: string;
    gender: string;
    profileImage: string;
    biography: string;
    email: string;
    phone: string;
  };
  professionalInfo: {
    title: string;
    yearsOfExperience: number;
    education: {
      degree: string;
      field: string;
      institution: string;
      year: number;
    }[];
    licenses: {
      type: string;
      licenseNumber: string;
      issuingAuthority: string;
      validUntil: string;
    }[];
  };
  practiceInfo: {
    specialties: string[];
    languages: { language: string; proficiencyLevel: string }[];
  };
  sessionInfo: {
    availability: {
      timeZone: string;
      weeklySchedule: {
        day: string;
        isWorkingDay: number;
        working_hours: { start: string | null; end: string | null };
      }[];
      communicationModes: string[];
    };
    pricing: {
      currency: string;
      rates: { sessionType: string; price: number; sessionTitle: string }[];
    };
  };
  verificationStatus: {
    isVerified: boolean;
    documentsVerified: boolean;
    backgroundCheckDate: string;
  };
  metrics: {
    totalSessions: number;
    averageRating: number;
    totalReviews: number;
    responseRate: number;
    cancellationRate: number;
  };
}

export default function OneCounsellorPage() {
  const searchParams = useSearchParams();
  const { setLoading } = useLoading();
  const id = searchParams.get("id");
  const [counsellor, setCounsellor] = useState<Counsellor | null>(null);

    const communicationIcons = [
      { mode: "chat", icon: <IoChatbubble size={20} />, title: "Chat" },
      { mode: "call", icon: <IoCall size={20} />, title: "Voice Call" },
      { mode: "video", icon: <IoVideocam size={20} />, title: "Video Call" },
      {
        mode: "in_person",
        icon: <IoPerson size={20} />,
        title: "Offline Session",
      },
    ];

  useEffect(() => {
    const fetchCounsellor = async (id: string) => {
      setLoading(true);
      try {
        const res = await getCounsellor(id);
        setCounsellor(res);
      } catch (error) {
        console.error("Error fetching counsellor data:", error);
        toast.error("Error fetching counsellor data");
      }
      setLoading(false);
    };

    if (id) fetchCounsellor(id);
    else toast.error("Counsellor ID not provided");
  }, [id]);

  if (!counsellor) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-[90%] mx-auto p-6 bg-white rounded-lg space-y-6">
      {/* Personal Info */}
      <div className="text-center">
        <img
          src={
            counsellor.personalInfo.profileImage || "/images/user-dummy-img.png"
          }
          alt={counsellor.personalInfo.name}
          className="w-32 h-32 mx-auto rounded-full shadow-md object-cover"
        />
        <h1 className="text-2xl font-semibold mt-4">
          {counsellor.personalInfo.name}
        </h1>
        <p className="text-gray-500">{counsellor.professionalInfo.title}</p>
        <p className="text-gray-600">
          {counsellor.professionalInfo.yearsOfExperience} years of experience •{" "}
          {counsellor.personalInfo.gender}
        </p>
        <p className="text-gray-600">{counsellor.personalInfo.biography}</p>
        <div className="flex justify-center mt-4 gap-4">
          <a
            href={`mailto:${counsellor.personalInfo.email}`}
            className="flex items-center text-blue-500 hover:underline"
          >
            <FaEnvelope className="mr-2" /> {counsellor.personalInfo.email}
          </a>
          <a
            href={`tel:${counsellor.personalInfo.phone}`}
            className="flex items-center text-green-500 hover:underline"
          >
            <FaPhone className="mr-2" /> {counsellor.personalInfo.phone}
          </a>
        </div>
      </div>

      <hr />
      {/* Verification Status */}

      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaUserCheck /> Verification Status
        </h2>

        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          {/* General Verification */}
          <p className="flex items-center text-sm">
            {counsellor.verificationStatus.isVerified ? (
              <FaCheckCircle className="text-green-500 mr-2" />
            ) : (
              <FaTimesCircle className="text-red-500 mr-2" />
            )}
            <span className="font-medium">Profile Verified:</span>{" "}
            {counsellor.verificationStatus.isVerified ? "Yes" : "No"}
          </p>

          {/* Documents Verified */}
          <p className="flex items-center text-sm">
            {counsellor.verificationStatus.documentsVerified ? (
              <FaCheckCircle className="text-green-500 mr-2" />
            ) : (
              <FaTimesCircle className="text-red-500 mr-2" />
            )}
            <span className="font-medium">Documents Verified:</span>{" "}
            {counsellor.verificationStatus.documentsVerified ? "Yes" : "No"}
          </p>

          {/* Background Check */}
          <p className="flex items-center text-sm">
            <FaChartBar className="text-blue-500 mr-2" />
            <span className="font-medium">Background Check Date:</span>{" "}
            {counsellor.verificationStatus.backgroundCheckDate
              ? counsellor.verificationStatus.backgroundCheckDate
              : "Not Available"}
          </p>
        </div>
      </div>

      <hr />

      {/* Specialties & Languages */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaTag /> Specialties
        </h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {counsellor.practiceInfo.specialties.map((spec, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {spec}
            </span>
          ))}
        </div>
        <h2 className="text-xl font-semibold flex items-center gap-2 my-4">
          <FaGlobe /> Languages
        </h2>
        <div className="flex flex-wrap gap-2">
          {counsellor.practiceInfo.languages.map((lang, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {lang.language} ({lang.proficiencyLevel})
            </span>
          ))}
        </div>
      </div>

      <hr />

      {/* Education & Licenses */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaGraduationCap /> Education
        </h2>
        <ul className="mt-2 space-y-2">
          {counsellor.professionalInfo.education.map((edu, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded-md">
              🎓 {edu.degree} in {edu.field} from{" "}
              <strong>{edu.institution}</strong> ({edu.year})
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold flex items-center gap-2 mt-4">
          <FaCertificate /> Licenses
        </h2>
        <ul className="mt-2 space-y-2">
          {counsellor.professionalInfo.licenses.map((lic, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded-md">
              🏅 {lic.type} - {lic.licenseNumber} (
              <strong>{lic.issuingAuthority}</strong>, Valid till{" "}
              {lic.validUntil})
            </li>
          ))}
        </ul>
      </div>

      <hr />

      {/* Schedule Section */}

      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaClock /> Weekly Schedule
        </h2>
        <p className="text-gray-500">
          Time Zone: {counsellor.sessionInfo.availability.timeZone}
        </p>

        <div className="mt-3 space-y-2">
          {counsellor.sessionInfo.availability.weeklySchedule.map(
            (day, index) => (
              <div
                key={index}
                className={`p-3 rounded-md flex items-center justify-between ${
                  day.isWorkingDay ? "bg-green-100" : "bg-gray-200"
                }`}
              >
                <span className="font-medium">{day.day}</span>
                {day.isWorkingDay ? (
                  <span className="text-green-700">
                    {day.working_hours.start} - {day.working_hours.end}
                  </span>
                ) : (
                  <span className="text-gray-500">Off Day</span>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <hr />

      {/* Session Info */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaClock /> Session Info
        </h2>
        <p className="flex gap-1 flex-wrap">
          <span>Communication Modes: </span>
          {counsellor.sessionInfo.availability.communicationModes.map(
            (mode, index) => (
              <span
                key={index}
                className="px-3 mx-1 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex gap-1 w-fit"
              >
                {
                  communicationIcons.filter((icon) => icon.mode === mode)[0]
                    .icon
                }
                {
                  communicationIcons.filter((icon) => icon.mode === mode)[0]
                    .title
                }
              </span>
            )
          )}
        </p>
        <h3 className="font-semibold mt-2">Pricing:</h3>
        <ul className="space-y-2">
          {counsellor.sessionInfo.pricing.rates.map((rate, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded-md">
              {rate.sessionTitle}: {counsellor.sessionInfo.pricing.currency}
              {rate.price}
            </li>
          ))}
        </ul>
      </div>

      <hr />

      {/* Performance Metrics */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaChartBar /> Performance Metrics
        </h2>
        <p>
          <FaStar className="text-yellow-500 inline mr-1" /> Rating:{" "}
          {counsellor.metrics.averageRating} / 5
        </p>
        <p>Sessions Conducted: {counsellor.metrics.totalSessions}</p>
        <p>Response Rate: {counsellor.metrics.responseRate}%</p>
        <p>Cancellation Rate: {counsellor.metrics.cancellationRate}%</p>

        {/* Progress Bars */}
        <div className="mt-4">
          <div className="text-sm text-gray-500">Response Rate</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${counsellor.metrics.responseRate}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mt-2">Cancellation Rate</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${counsellor.metrics.cancellationRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
