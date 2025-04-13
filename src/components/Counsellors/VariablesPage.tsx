"use client";

import { getCounsellorCommissions, updateCounsellorCommissions } from "@/utils/counsellor";
import { useEffect, useState } from "react";
import { IoEye, IoEyeOff, IoPencil } from "react-icons/io5";
import { toast } from "react-toastify";

export default function VariablesPage() {
  // State for tax & commission values (default hidden)
  const [variables, setVariables] = useState([
    {
      id: "counsellor_commission",
      title: "Counsellor Commission (%)",
      value: 0,
      hidden: true,
    },
  ]);

  // State for editing values
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
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
    // Generate a random 8-character confirmation code
    const generateCode = () => {
      const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
      let code = "";
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    setConfirmationCode(generateCode());
    setShowDialog(true);
  };

  // Function to apply updates
  const handleConfirmUpdate = async () => {
    if (!editingId || tempValue === null) return;

    if (userInputCode !== confirmationCode) {
      toast.error("Confirmation code does not match. Please try again.");
      return;
    }

    const updatedVariables = variables.map((item) =>
      item.id === editingId ? { ...item, value: tempValue } : item
    );

    setVariables(updatedVariables);
    setEditingId(null);
    setShowDialog(false);
    setUserInputCode("");
    setConfirmUpdate(false);

    // Update the backend
    const res = await updateCounsellorCommissions(tempValue);
    if (res) {
      toast.success("Counsellor commission updated successfully!");
    } else {
      toast.error("Failed to update counsellor commission!");
    }
  };

  const fetchCounsellorCommission = async () => {
    const res = await getCounsellorCommissions();
    setVariables([
      {
        id: "counsellor_commission",
        title: "Counsellor Commission (%)",
        value: res,
        hidden: true,
      },
    ]);
  };

  useEffect(() => {
    fetchCounsellorCommission();
  }, []);

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center text-indigo-600">
        Commission Settings
      </h1>

      {/* Warning/Note */}
      <p className="text-sm text-center text-red-500 mb-4">
        Note: The number entered will represent the commission percentage for
        the counsellor. For example, if it's 90% and the fees are ₹1000, ₹900
        will go to the counsellor, and ₹100 to the company.
      </p>

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
              Please enter the following confirmation code to proceed:
            </p>

            {/* Display Confirmation Code */}
            <div className="mt-3 px-4 py-2 bg-gray-100 text-gray-800 font-mono text-center rounded-md select-none">
              {confirmationCode}
            </div>

            {/* Input for Confirmation Code */}
            <input
              type="text"
              placeholder="Enter the confirmation code"
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              className="w-full mt-3 px-3 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

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
                disabled={userInputCode !== confirmationCode}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  userInputCode !== confirmationCode
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
