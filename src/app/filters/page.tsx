"use client";

import { useEffect, useState } from "react";
import {
  getFilters,
  updatePriorities,
  addFilterItem,
  deleteFilterItem,
} from "@/utils/filters";
import { IoAdd, IoTrash, IoPencil, IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaLanguage, FaUser, FaTags } from "react-icons/fa";

export default function FilterManagement() {
  type Filter = { id: number; name: string; priority: number };

  const [languages, setLanguages] = useState<Filter[]>([]);
  const [specialties, setSpecialties] = useState<Filter[]>([]);
  const [genders, setGenders] = useState<Filter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editItem, setEditItem] = useState<Filter | null>(null);
  const [modalType, setModalType] = useState<
    "language" | "specialty" | "gender" | null
  >(null);
  const [newItem, setNewItem] = useState({ name: "", priority: 1 });
  const [deleteItem, setDeleteItem] = useState<{
    type: string;
    id: number;
  } | null>(null);

  const fetchFilters = async () => {
    
    const filters = await getFilters();
    setLanguages(
      filters.languages?.sort((a:Filter, b:Filter) => b.priority - a.priority) || []
    );
    setSpecialties(
      filters.specialties?.sort((a:Filter, b:Filter) => b.priority - a.priority) || []
    );
    setGenders(filters.genders?.sort((a:Filter, b:Filter) => b.priority - a.priority) || []);
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const filteredData = (data: Filter[]) =>
    data
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.priority.toString().includes(searchTerm)
      )
      .sort((a, b) => b.priority - a.priority);

  const handleAdd = async () => {
    if (!newItem.name.trim() || !modalType)
      return toast.error("Enter valid details");

    const typeKey = `new${
      modalType.charAt(0).toUpperCase() + modalType.slice(1)
    }` as "newLanguage" | "newSpecialty" | "newGender";

    const res = await addFilterItem(typeKey, newItem.name, newItem.priority);
    if (res) {
      toast.success(`${modalType} added successfully`);
      setNewItem({ name: "", priority: 1 });
      setModalType(null);
      fetchFilters();
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    const res = await deleteFilterItem(deleteItem.type as any, deleteItem.id);
    if (res) {
      toast.success("Item deleted successfully");
      fetchFilters();
      setDeleteItem(null);
    }
  };

  const handleEditPriority = async () => {
    if (!editItem) return;

    const type =
      editItem.id <= 100
        ? "languages"
        : editItem.id <= 200
        ? "specialties"
        : "genders";

    const res = await updatePriorities({
      [type]: [{ id: editItem.id, priority: editItem.priority }],
    });
    if (res) {
      toast.success("Priority updated successfully");
      fetchFilters();
      setEditItem(null);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Filter Management
      </h1>

      <input
        type="text"
        placeholder="Search filters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mb-6"
      />

      {[
        {
          title: "Languages",
          icon: <FaLanguage />,
          data: filteredData(languages),
          type: "language" as const,
          deleteType: "deleteLanguage",
        },
        {
          title: "Specialties",
          icon: <FaTags />,
          data: filteredData(specialties),
          type: "specialty" as const,
          deleteType: "deleteSpecialty",
        },
        {
          title: "Genders",
          icon: <FaUser />,
          data: filteredData(genders),
          type: "gender" as const,
          deleteType: "deleteGender",
        },
      ].map(({ title, icon, data, type, deleteType }) => (
        <div key={title} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {icon} {title}
            </h2>
            <button
              onClick={() => setModalType(type)}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
            >
              <IoAdd size={16} /> Create
            </button>
          </div>

          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 p-3 flex justify-between rounded-md"
              >
                <span>
                  {item.name} (Priority: {item.priority})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditItem(item)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <IoPencil size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteItem({ type: deleteType, id: item.id })
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    <IoTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Create Filter Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              onClick={() => setModalType(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
            >
              <IoClose size={24} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Create New{" "}
              {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>

            <input
              type="text"
              placeholder="Enter Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border rounded-md px-3 py-2 w-full mb-3"
            />

            <input
              type="number"
              placeholder="Priority"
              value={newItem.priority || 0}
              onChange={(e) =>
                setNewItem({ ...newItem, priority: parseInt(e.target.value) })
              }
              className="border rounded-md px-3 py-2 w-full"
            />

            <button
              onClick={handleAdd}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setDeleteItem(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <IoClose size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setEditItem(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <IoClose size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit Priority</h3>
            <input
              type="number"
              value={editItem.priority || 0}
              onChange={(e) =>
                setEditItem({ ...editItem, priority: parseInt(e.target.value) })
              }
              className="border rounded-md px-3 py-2 w-full"
            />
            <button
              onClick={handleEditPriority}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
