"use client";

import { useEffect, useState } from "react";
import { IoTrash, IoPersonAdd, IoSearch } from "react-icons/io5";
import AddAdminModal from "@/components/Admin/AddAdminModal";
import { addAdmins, deleteAdmins, getAdmins } from "@/utils/admins";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "react-toastify";


export default function AdminManagement() {
  const [admins, setAdmins] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      role: string;
    }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const { setLoading } = useLoading();
  // Delete Admin Function
  const handleDeleteAdmin = async (email: string) => {
    setLoading(true);
    const res = await deleteAdmins(email);
    if (res) {
      toast.success("Admin deleted successfully!");
      fetchAdmins();
    } else {
      toast.error("Failed to delete admin. Please try again.");
    }
    setLoading(false);
  };
  const fetchAdmins = async () => {
    setLoading(true);
    const adminsres = await getAdmins();
    setAdmins(adminsres);
    setLoading(false);
  };
  useEffect(() => {

    fetchAdmins();
  }, []);

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add New Admin Function
  const handleAddAdmin = async (newAdmin: {
    name: string;
    email: string;
  }) => {
    setLoading(true);
    const res = await addAdmins(newAdmin.name, newAdmin.email);
    if (res) {
      toast.success("Admin added successfully!");
      setModalOpen(false);
      fetchAdmins();
    }
    else{
      toast.error("Failed to add admin. Please try again.");
    }
    setLoading(false);

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
                      onClick={() => handleDeleteAdmin(admin.email)}
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
