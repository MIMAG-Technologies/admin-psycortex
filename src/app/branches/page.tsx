"use client";

import { useState } from "react";
import { IoSearch, IoAddCircle } from "react-icons/io5";
import AddBranchModal from "@/components/Branches/AddBranchModal";
import BranchCard from "@/components/Branches/BranchCard";

// Dummy Data
const initialBranches = [
  {
    id: "b101",
    cityName: "Mumbai",
    fullAddress: "123 Marine Drive, Mumbai, Maharashtra, India",
    counsellorsAvailable: 12,
  },
  {
    id: "b102",
    cityName: "Delhi",
    fullAddress: "56 Connaught Place, New Delhi, India",
    counsellorsAvailable: 8,
  },
  {
    id: "b103",
    cityName: "Bangalore",
    fullAddress: "78 MG Road, Bangalore, Karnataka, India",
    counsellorsAvailable: 10,
  },
  {
    id: "b104",
    cityName: "Chennai",
    fullAddress: "98 Mount Road, Chennai, Tamil Nadu, India",
    counsellorsAvailable: 6,
  },
  {
    id: "b105",
    cityName: "Kolkata",
    fullAddress: "45 Park Street, Kolkata, West Bengal, India",
    counsellorsAvailable: 9,
  },
];

export default function BranchesManagement() {
  const [branches, setBranches] = useState(initialBranches);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  // Filter branches based on search query
  const filteredBranches = branches.filter((branch) =>
    branch.cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add New Branch Function
  const handleAddBranch = (newBranch: {
    id: string;
    cityName: string;
    fullAddress: string;
  }) => {
    setBranches((prev) => [
      ...prev,
      { ...newBranch, counsellorsAvailable: Math.floor(Math.random() * 20) },
    ]);
  };

  // Edit & Delete Functions (Dummy for now)
  const handleEditBranch = (id: string) => {
    alert(`Editing Branch: ${id}`);
  };

  const handleDeleteBranch = (id: string) => {
    setBranches((prev) => prev.filter((branch) => branch.id !== id));
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Branches Management
      </h1>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Branches by City"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
          />
          <IoSearch
            className="absolute top-3 right-3 text-gray-500"
            size={20}
          />
        </div>

        {/* Add Branch Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
        >
          <IoAddCircle size={18} />
          Create Branch
        </button>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <BranchCard
            key={branch.id}
            id={branch.id}
            cityName={branch.cityName}
            fullAddress={branch.fullAddress}
            counsellorsAvailable={branch.counsellorsAvailable}
            onEdit={handleEditBranch}
            onDelete={handleDeleteBranch}
          />
        ))}
      </div>

      {/* Add Branch Modal */}
      {isModalOpen && (
        <AddBranchModal
          onClose={() => setModalOpen(false)}
          onAdd={handleAddBranch}
        />
      )}
    </div>
  );
}
