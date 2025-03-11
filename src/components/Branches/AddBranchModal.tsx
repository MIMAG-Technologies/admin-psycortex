"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function AddBranchModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (branch: {
    id: string;
    cityName: string;
    fullAddress: string;
  }) => void;
}) {
  const [cityName, setCityName] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const handleSubmit = () => {
    if (!cityName || !fullAddress) return alert("Both fields are required.");
    onAdd({
      id: Math.random().toString(36).substring(2, 9),
      cityName,
      fullAddress,
    });
    onClose();
  };

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
          Create New Branch
        </h2>

        {/* City Name Field */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            City Name
          </label>
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Enter city name"
          />
        </div>

        {/* Full Address Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Full Address
          </label>
          <textarea
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Enter full address"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
        >
          Add Branch
        </button>
      </div>
    </div>
  );
}
