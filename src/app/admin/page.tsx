"use client";

import { useState } from "react";
import { IoTrash, IoPersonAdd, IoSearch } from "react-icons/io5";
import AddAdminModal from "@/components/Admin/AddAdminModal";

// Dummy Data for Admins
const initialAdmins = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@company.com",
    role: "superadmin",
  },
  {
    id: "2",
    name: "Ananya Iyer",
    email: "ananya@company.com",
    role: "superadmin",
  },
  { id: "3", name: "Vikram Singh", email: "vikram@company.com", role: "admin" },
  { id: "4", name: "Neha Sharma", email: "neha@company.com", role: "admin" },
  {
    id: "5",
    name: "Karthik Reddy",
    email: "karthik@company.com",
    role: "admin",
  },
];

export default function AdminManagement() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete Admin Function
  const handleDeleteAdmin = (id: string) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
  };

  // Add New Admin Function
  const handleAddAdmin = (newAdmin: {
    id: string;
    name: string;
    email: string;
  }) => {
    setAdmins((prev) => [...prev, { ...newAdmin, role: "admin" }]);
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Admin Management
      </h1>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Admins by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
          />
          <IoSearch
            className="absolute top-3 right-3 text-gray-500"
            size={20}
          />
        </div>

        {/* Add Admin Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
        >
          <IoPersonAdd size={18} />
          Add Admin
        </button>
      </div>

      {/* List of Admins */}
      <div className="space-y-4">
        {/* Super Admins Section */}
        {filteredAdmins.some((admin) => admin.role === "superadmin") && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Super Admins
            </h2>
            <div className="space-y-2">
              {filteredAdmins
                .filter((admin) => admin.role === "superadmin")
                .map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between bg-gray-100 p-3 border rounded-md"
                  >
                    <span className="text-gray-800 font-medium">
                      {admin.name} ({admin.email})
                    </span>
                    <span className="text-indigo-600 font-medium">
                      Super Admin
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Regular Admins Section */}
        {filteredAdmins.some((admin) => admin.role === "admin") && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-3">
              Admins
            </h2>
            <div className="space-y-2">
              {filteredAdmins
                .filter((admin) => admin.role === "admin")
                .map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between bg-gray-100 p-3 border rounded-md"
                  >
                    <span className="text-gray-800 font-medium">
                      {admin.name} ({admin.email})
                    </span>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <IoTrash size={18} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <AddAdminModal
          onClose={() => setModalOpen(false)}
          onAdd={handleAddAdmin}
        />
      )}
    </div>
  );
}
