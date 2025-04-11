"use client";

import React from "react";
import { UserDetails } from "@/types/user";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaGlobe,
  FaCalendarAlt,
  FaComments,
  FaPhoneAlt,
  FaVials,
  FaUserClock,
} from "react-icons/fa";

export default function UserDetailedView({ user }: { user: UserDetails }) {
  const { personalInfo, preferences, accountInfo, stats } = user;

  const Section = ({
    title,
    icon,
    children,
    accentColor = "bg-sky-50",
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    accentColor?: string;
  }) => (
    <div className={`rounded-xl border shadow-sm ${accentColor}`}>
      <div className="px-5 py-4 border-b flex items-center gap-3 text-gray-800 font-semibold text-base">
        {icon} {title}
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const Item = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm border hover:shadow-md transition-all">
      <div className="mt-1 text-blue-500">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 my-6 mx-auto">
      {/* Personal Info */}
      <Section
        title="Personal Information"
        icon={<FaUser />}
        accentColor="bg-slate-50"
      >
        {/* Left Column: Email & Phone */}
        <div className="flex flex-col gap-4">
          <Item
            label="Email"
            value={personalInfo.email}
            icon={<FaEnvelope />}
          />
          <Item label="Phone" value={personalInfo.phone} icon={<FaPhone />} />
        </div>

        {/* Right Column: Name, Gender, DOB, Image */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-md shadow-sm border">
          <img
            src={personalInfo.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border shadow"
          />
          <div className="space-y-2">
            <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-500" /> {personalInfo.name}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaVenusMars className="text-pink-500" /> {personalInfo.gender}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaBirthdayCake className="text-yellow-500" />{" "}
              {new Date(personalInfo.dateOfBirth).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Preferences and Account Info"
        icon={<FaGlobe />}
        accentColor="bg-emerald-50"
      >
        <Item
          label="Timezone"
          value={preferences.timezone}
          icon={<FaGlobe />}
        />
        <Item
          label="Account Created At"
          value={new Date(accountInfo.createdAt).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          icon={<FaCalendarAlt />}
        />
      </Section>

      {/* Stats: Counselling */}
      <Section
        title="Video Counselling Stats"
        icon={<FaUserClock />}
        accentColor="bg-blue-50"
      >
        {Object.entries(stats.counselling).map(([key, value]) => (
          <Item
            key={key}
            label={capitalize(key)}
            value={value}
            icon={<FaUserClock />}
          />
        ))}
      </Section>

      {/* Stats: Chat */}
      <Section
        title="Chat Counselling Stats"
        icon={<FaComments />}
        accentColor="bg-purple-50"
      >
        {Object.entries(stats.chat).map(([key, value]) => (
          <Item
            key={key}
            label={capitalize(key)}
            value={value}
            icon={<FaComments />}
          />
        ))}
      </Section>

      {/* Stats: Call */}
      <Section
        title="Call Counselling Stats"
        icon={<FaPhoneAlt />}
        accentColor="bg-yellow-50"
      >
        {Object.entries(stats.call).map(([key, value]) => (
          <Item
            key={key}
            label={capitalize(key)}
            value={value}
            icon={<FaPhoneAlt />}
          />
        ))}
      </Section>
      {/* Stats: Offline */}
      <Section
        title="Offline Counselling Stats"
        icon={<FaUserClock />}
        accentColor="bg-orange-50"
      >
        {Object.entries(stats.offline).map(([key, value]) => (
          <Item
            key={key}
            label={capitalize(key)}
            value={value}
            icon={<FaUserClock />}
          />
        ))}
      </Section>

      {/* Stats: Test */}
      <Section title="Tests Stats" icon={<FaVials />} accentColor="bg-pink-50">
        {Object.entries(stats.tests).map(([key, value]) => (
          <Item
            key={key}
            label={capitalize(key)}
            value={value}
            icon={<FaVials />}
          />
        ))}
      </Section>
    </div>
  );
}

const capitalize = (s: string) =>
  s
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ");
