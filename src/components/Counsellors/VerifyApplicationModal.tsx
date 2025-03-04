"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface VerifyApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  counsellorEmail: string;
}

export default function VerifyApplicationModal({
  isOpen,
  onClose,
  onVerify,
  counsellorEmail,
}: VerifyApplicationModalProps) {
  const [agreements, setAgreements] = useState({
    basicDetails: false,
    professionalInfo: false,
    communicationModes: false,
    languagesAndSpecialties: false,
    schedule: false,
    backgroundCheck: false,
    finalAgreement: false,
  });

  const [email, setEmail] = useState("");

  const handleAgreementChange = (field: keyof typeof agreements) => {
    setAgreements({ ...agreements, [field]: !agreements[field] });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Verify Application
        </h2>

        {/* Checkboxes */}
        <div className="mt-4 space-y-3">
          {Object.keys(agreements).map((key) => (
            <label key={key} className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={agreements[key as keyof typeof agreements]}
                onChange={() =>
                  handleAgreementChange(key as keyof typeof agreements)
                }
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-600 text-sm">
                {key === "finalAgreement"
                  ? "I confirm that all entered information is correct."
                  : `I confirm that the ${key.replace(
                      /([A-Z])/g,
                      " $1"
                    )} details are accurate.`}
              </span>
            </label>
          ))}
        </div>

        {/* Email Verification */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            Counsellor Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            placeholder="Enter counsellor email"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={onVerify}
          disabled={
            !Object.values(agreements).every(Boolean) ||
            email !== counsellorEmail
          }
          className={`mt-4 w-full px-4 py-2 rounded-md text-white font-medium transition ${
            Object.values(agreements).every(Boolean) &&
            email === counsellorEmail
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
