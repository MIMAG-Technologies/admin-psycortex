import { useState } from "react";

export default function Verification({
  counsellorEmail,
  createUser,
}: {
  counsellorEmail: string;
  createUser: () => Promise<void>;
}) {
  const [email, setEmail] = useState(counsellorEmail);
  const [agreements, setAgreements] = useState({
    basicDetails: false,
    professionalInfo: false,
    communicationModes: false,
    languagesAndSpecialties: false,
    schedule: false,
    backgroundCheck: false,
    finalAgreement: false,
  });

  const handleAgreementChange = (field: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      {/* Checkboxes Section */}
      <div className="space-y-3">
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreements.basicDetails}
            onChange={() => handleAgreementChange("basicDetails")}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-600 text-sm">
            I confirm that the <b>Basic Counsellor Details</b> (Name, Email,
            Phone, etc.) are accurate and verified.
          </span>
        </label>

        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreements.professionalInfo}
            onChange={() => handleAgreementChange("professionalInfo")}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-600 text-sm">
            I confirm that the <b>Professional Information</b> (Title,
            Experience, Licenses, and Education) is correct.
          </span>
        </label>

        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreements.communicationModes}
            onChange={() => handleAgreementChange("communicationModes")}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-600 text-sm">
            I confirm that the <b>Communication Modes & Pricing</b> information
            is correctly set.
          </span>
        </label>

        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreements.languagesAndSpecialties}
            onChange={() => handleAgreementChange("languagesAndSpecialties")}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-600 text-sm">
            I confirm that the <b>Languages & Specialties</b> information is
            valid and up-to-date.
          </span>
        </label>

        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreements.schedule}
            onChange={() => handleAgreementChange("schedule")}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-600 text-sm">
            I confirm that the <b>Weekly Schedule</b> is accurate.
          </span>
        </label>

        {/* Background Check */}
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreements.backgroundCheck}
            onChange={() => handleAgreementChange("backgroundCheck")}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-600 text-sm">
            I verify that the <b>counsellor's background</b> has been checked
            and is clear.
          </span>
        </label>

        {/* Final Agreement */}
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreements.finalAgreement}
            onChange={() => handleAgreementChange("finalAgreement")}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-600 text-sm">
            I confirm that <b>all entered information is correct</b>, and I take
            responsibility for its accuracy.
          </span>
        </label>
      </div>

      {/* Email Verification */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
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
        onClick={createUser}
        className={`mt-6 w-full px-4 py-2 rounded-md text-white font-medium transition ${
          Object.values(agreements).every(Boolean)
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!Object.values(agreements).every(Boolean)}
      >
        Submit
      </button>
    </div>
  );
}
