"use client";

import React from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface AppointmentModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  record: {
    counsellor_id: string;
    counsellor_name: string;
    date_time: string;
    duration: number;
    location: {
      id: string;
      city: string;
      full_address: string;
    };
  } | null;
  onYes: () => void;
}

const formatDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  setIsOpen,
  record,
  onYes,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Header */}
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserMd className="text-blue-500" />
          Previous Appointment Found
        </h2>
        <p className="text-gray-600 mt-2">
          The User previously had an appointment with{" "}
          <span className="font-medium text-gray-800">
            {record.counsellor_name}
          </span>
          .
        </p>

        {/* Appointment Details */}
        <div className="mt-4 bg-gray-100 p-4 rounded-md space-y-2">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" />
            <strong>Date & Time:</strong> {formatDateTime(record.date_time)}
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaClock className="text-blue-500" />
            <strong>Duration:</strong> {record.duration} minutes
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500" />
            <strong>Location:</strong> {record.location.full_address}
          </p>
        </div>

        {/* Question */}
        <p className="text-gray-800 mt-4 font-medium text-center">
          Do you want to use the same details?
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-5 w-full">
          <Button  className="w-[49%]" variant="outline" onClick={() => setIsOpen(false)}>
            No
          </Button>
          <Button className="w-[49%]" 
            variant="default"
            onClick={() => {
              onYes();
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
