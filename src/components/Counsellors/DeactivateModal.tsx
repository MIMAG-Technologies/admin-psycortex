import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function DeactivateModal({
  isOpen,
  onClose,
  onSubmit,
  counsellorName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (startDate: string, endDate: string, message: string) => void;
  counsellorName: string;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Deactivate {counsellorName}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Please provide the duration and reason for deactivating this
          counsellor.
        </p>

        {/* Date Inputs */}
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
        />

        {/* Message Input */}
        <label className="block text-sm font-medium text-gray-700 mt-3">
          Reason for Deactivation
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
          placeholder="Enter reason here..."
        ></textarea>

        {/* Submit Button */}
        <button
          onClick={() => {
            if (!startDate || !endDate || !message) {
              alert("Please fill all fields before submitting.");
              return;
            }
            onSubmit(startDate, endDate, message);
          }}
          className="mt-4 w-full px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Confirm Deactivation
        </button>
      </div>
    </div>
  );
}
