"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentDetails } from "@/types/user";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaIdBadge,
  FaLaptopMedical,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaHeart,
  FaUsers,
  FaFingerprint,
  FaStethoscope,
  FaHistory,
  FaBrain,
  FaBook,
  FaLightbulb,
  FaComments,
  FaListAlt,
} from "react-icons/fa";

type Props = {
  open: boolean;
  onClose: () => void;
  data: AppointmentDetails | null;
};

export const AppointmentDetailModal: React.FC<Props> = ({
  open,
  onClose,
  data,
}) => {
  if (!data) return null;

  const { user_details, counsellor_details, session_details, case_history } =
    data;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Session Details
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable modal content */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          {/* ================= USER INFO ================= */}
          <Section title="User Information" icon={<FaUser />}>
            <Item label="Name" value={user_details.name} icon={<FaIdBadge />} />
            <Item
              label="Email"
              value={user_details.email}
              icon={<FaEnvelope />}
            />
            <Item label="Phone" value={user_details.phone} icon={<FaPhone />} />
            <Item
              label="DOB"
              value={user_details.date_of_birth}
              icon={<FaBirthdayCake />}
            />
            <Item
              label="Gender"
              value={user_details.gender}
              icon={<FaVenusMars />}
            />
            <Item label="Age" value={user_details.age} icon={<FaUser />} />
          </Section>

          {/* ================= SESSION INFO ================= */}
          <Section title="Session Info" icon={<FaCalendarAlt />}>
            <Item
              label="Session ID"
              value={session_details.session_id}
              icon={<FaIdBadge />}
            />
            <Item
              label="Type"
              value={session_details.session_type}
              icon={<FaLaptopMedical />}
            />
            <Item
              label="Created At"
              value={new Date(session_details.created_at).toLocaleString()}
              icon={<FaCalendarAlt />}
            />
          </Section>

          {/* ================= COUNSELLOR INFO ================= */}
          <Section title="Counsellor Info" icon={<FaChalkboardTeacher />}>
            <Item
              label="Name"
              value={counsellor_details.name}
              icon={<FaUser />}
            />
          </Section>

          {/* ================= CASE HISTORY ================= */}
          <Section title="Case History" icon={<FaListAlt />}>
            <Item
              label="Address"
              value={case_history.address}
              icon={<FaMapMarkerAlt />}
            />
            <Item
              label="Education"
              value={case_history.education}
              icon={<FaGraduationCap />}
            />
            <Item
              label="Occupation"
              value={case_history.occupation}
              icon={<FaBriefcase />}
            />
            <Item
              label="Marital Status"
              value={case_history.marital_status}
              icon={<FaHeart />}
            />
            <Item
              label="Family Type"
              value={case_history.family_type}
              icon={<FaUsers />}
            />
            <Item
              label="Family Members"
              value={case_history.family_members}
              icon={<FaUsers />}
            />
            <Item
              label="Identification Marks"
              value={case_history.identification_marks.join(", ")}
              icon={<FaFingerprint />}
            />
            <Item
              label="Reliability"
              value={case_history.reliability}
              icon={<FaUser />}
            />
            <Item
              label="Previous Consultation"
              value={case_history.previous_consultation ? "Yes" : "No"}
              icon={<FaHistory />}
            />
            <Item
              label="Previous Consultation Details"
              value={case_history.previous_consultation_details}
              icon={<FaHistory />}
            />
          </Section>

          {/* ================= MEDICAL HISTORY ================= */}
          <Section title="Medical History" icon={<FaStethoscope />}>
            {Object.entries(case_history.medical_history).map(
              ([label, value]) => (
                <Item
                  key={label}
                  label={toTitle(label)}
                  value={value}
                  icon={<FaHistory />}
                />
              )
            )}
          </Section>

          {/* ================= PERSONAL HISTORY ================= */}
          <Section title="Personal History" icon={<FaUser />}>
            {Object.entries(case_history.personal_history).map(
              ([label, value]) => (
                <Item
                  key={label}
                  label={toTitle(label)}
                  value={value}
                  icon={<FaBook />}
                />
              )
            )}
          </Section>

          {/* ================= MENTAL STATUS ================= */}
          <Section title="Mental Status" icon={<FaBrain />}>
            <Item
              label="General Appearance"
              value={case_history.mental_status.general_appearance}
              icon={<FaUser />}
            />
            <Item
              label="Attitude"
              value={case_history.mental_status.attitude}
              icon={<FaUser />}
            />
            <Item
              label="Motor Behavior"
              value={case_history.mental_status.motor_behavior}
              icon={<FaUser />}
            />
            <Item
              label="Speech"
              value={case_history.mental_status.speech}
              icon={<FaComments />}
            />
            <Item
              label="Mood & Affect"
              value={case_history.mental_status.mood_affect}
              icon={<FaHeart />}
            />
          </Section>
            <Section
              title="Cognitive Functions"
              icon={<FaLightbulb />}
            >
              {Object.entries(
                case_history.mental_status.cognitive_functions
              ).map(([label, value]) => (
                <Item
                  key={label}
                  label={toTitle(label)}
                  value={value}
                  icon={<FaLightbulb />}
                />
              ))}
            </Section>

            <Section title="Thought Process" icon={<FaBrain />}>
              {Object.entries(case_history.mental_status.thought_process).map(
                ([label, value]) => (
                  <Item
                    key={label}
                    label={toTitle(label)}
                    value={value}
                    icon={<FaBrain />}
                  />
                )
              )}
            </Section>

          {/* ================= FOLLOW UP ================= */}
          <Section title="Follow Up" icon={<FaCalendarAlt />}>
            <Item
              label="Advice/Activities"
              value={case_history.follow_up.advice_activities}
              icon={<FaComments />}
            />
            <Item
              label="Follow Up Session"
              value={case_history.follow_up.follow_up_session}
              icon={<FaCalendarAlt />}
            />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Section = ({
  title,
  children,
  icon,
  className,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-slate-100 p-4 rounded-lg border space-y-2  ${className || ""}`}>
    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
      {icon} {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
      {children}
    </div>
  </div>
);

const Item = ({
    label,
    value,
    icon,
    className,
}: {
    label: string;
    value: string | number | boolean;
    icon: React.ReactNode;
    className?: string;
}) => (
    <p className={`flex items-start gap-2 ${className || ""}`}>
        <span className="mt-1">{icon}</span>
        <span>
            <strong>{label}:</strong> {String(value)}
        </span>
    </p>
);

const toTitle = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
