"use client";

import { useState } from "react";
import { IoEye, IoEyeOff, IoPencil } from "react-icons/io5";

export default function VariablesPage() {
  // State for tax & commission values (default hidden)
  const [variables, setVariables] = useState([
    {
      id: "tax_chat",
      title: "Tax on Chat Booking (%)",
      value: 5,
      hidden: true,
    },
    {
      id: "tax_call",
      title: "Tax on Call Booking (%)",
      value: 8,
      hidden: true,
    },
    {
      id: "tax_video",
      title: "Tax on Video Booking (%)",
      value: 10,
      hidden: true,
    },
    {
      id: "tax_in_person",
      title: "Tax on In-Person Booking (%)",
      value: 12,
      hidden: true,
    },
    {
      id: "counsellor_commission",
      title: "Counsellor Commission (%)",
      value: 20,
      hidden: true,
    },
  ]);

  // State for editing values
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  // Function to toggle visibility
  const toggleVisibility = (id: string) => {
    setVariables((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hidden: !item.hidden } : item
      )
    );
  };

  // Function to handle edit click
  const handleEdit = (id: string, value: number) => {
    setEditingId(id);
    setTempValue(value);
  };

  // Function to cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setTempValue(null);
  };

  // Function to confirm update (open dialog)
  const handleUpdateClick = () => {
    setShowDialog(true);
  };

  // Function to apply updates
  const handleConfirmUpdate = () => {
    if (!editingId || tempValue === null) return;

    setVariables((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, value: tempValue } : item
      )
    );

    setEditingId(null);
    setShowDialog(false);
    setEmail("");
    setConfirmUpdate(false);
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Global Tax & Commission Settings
      </h1>

      {/* List of Variables */}
      <div className="space-y-4">
        {variables.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white p-4 border rounded-lg shadow-sm"
          >
            {/* Title */}
            <span className="text-gray-700 font-medium">{item.title}</span>

            {/* Input & Icons */}
            <div className="flex items-center gap-3">
              {/* Input Field */}
              {editingId === item.id ? (
                <input
                  type="number"
                  value={tempValue ?? ""}
                  onChange={(e) => setTempValue(Number(e.target.value))}
                  className="w-20 px-3 py-1 border rounded-md text-gray-800 text-center focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              ) : (
                <span
                  className={`text-xl font-semibold ${
                    item.hidden ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {item.hidden ? "•••" : `${item.value}%`}
                </span>
              )}

              {/* Eye Icon */}
              <button
                onClick={() => toggleVisibility(item.id)}
                className="text-gray-600 hover:text-gray-800 transition"
              >
                {item.hidden ? <IoEyeOff size={22} /> : <IoEye size={22} />}
              </button>

              {/* Edit & Update Buttons */}
              {editingId === item.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateClick}
                    className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(item.id, item.value)}
                  className="text-gray-600 hover:text-gray-800 transition"
                >
                  <IoPencil size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Update Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Update
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Please confirm the update by verifying your email.
            </p>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-3 px-3 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            {/* Checkbox */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={confirmUpdate}
                onChange={() => setConfirmUpdate(!confirmUpdate)}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label className="text-sm text-gray-600">
                I confirm this update
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                disabled={!email || !confirmUpdate}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  !email || !confirmUpdate
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
