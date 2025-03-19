"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function AddBranchModal({
  onClose,
  onAdd,
  cityList,
}: {
  onClose: () => void;
  cityList: Array<string>;
  onAdd: (branch: {
    city: string;
    street_address: string;
    state: string;
    pincode: string;
  }) => Promise<void>;
}) {
  const [city, setcity] = useState<string>("");
  const [street_address, setstreet_address] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");

  const handleSubmit = () => {
    if (!city || !street_address || !state || !pincode)
      return toast.info("All fields are required.");
    onAdd({
      city,
      street_address,
      state,
      pincode,
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
            value={city}
            onChange={(e) => setcity(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Enter city name"
            list="cityOptions"
          />
          <datalist id="cityOptions">
            {cityList.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
        </div>

        {/* Full Address Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <textarea
            value={street_address}
            onChange={(e) => setstreet_address(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Enter street address"
            rows={3}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Enter state name"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
            placeholder="Enter pincode"
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
