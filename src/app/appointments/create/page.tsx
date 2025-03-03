'use client';
import { useState } from "react";
import { FaUser, FaUserMd, FaCalendar, FaClock } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function CreateAppointment() {
  const [user, setUser] = useState("");
  const [counsellor, setCounsellor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");

  const validateForm = () => {
    if (!user) {
      toast.error("Please select a user");
      return false;
    }
    if (!counsellor) {
      toast.error("Please select a counsellor");
      return false;
    }
    if (!date) {
      toast.error("Please select a date");
      return false;
    }
    if (!time) {
      toast.error("Please select a time");
      return false;
    }
    if (!problem) {
      toast.error("Please describe the problem");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted", { user, counsellor, date, time, problem });
      toast.success("Appointment Created Successfully!");
      // Reset the form
      setUser("");
      setCounsellor("");
      setDate("");
      setTime("");
      setProblem("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        Create An Offline Appointment
      </h1>
      <form
        className="bg-white shadow-xl rounded-2xl px-10 py-12 w-full max-w-3xl border border-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-lg flex items-center gap-2 font-medium text-gray-700">
            <FaUser className="text-blue-500" /> User
          </label>
          <select
            className="border border-gray-300 rounded-lg w-full h-14 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          >
            <option value="" disabled>
              Choose A User
            </option>
            <option value="User 1">User 1</option>
            <option value="User 2">User 2</option>
            <option value="User 3">User 3</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="text-lg flex items-center gap-2 font-medium text-gray-700">
            <FaUserMd className="text-blue-500" /> Counsellor
          </label>
          <select
            className="border border-gray-300 rounded-lg w-full h-14 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
            value={counsellor}
            onChange={(e) => setCounsellor(e.target.value)}
          >
            <option value="" disabled>
              Choose A Counsellor
            </option>
            <option value="Counsellor 1">Counsellor 1</option>
            <option value="Counsellor 2">Counsellor 2</option>
            <option value="Counsellor 3">Counsellor 3</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-lg flex items-center gap-2 font-medium text-gray-700">
              <FaCalendar className="text-blue-500" /> Date
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg w-full h-14 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-lg flex items-center gap-2 font-medium text-gray-700">
              <FaClock className="text-blue-500" /> Time Slot
            </label>
            <input
              type="time"
              className="border border-gray-300 rounded-lg w-full h-14 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <label className="text-lg flex items-center gap-2 font-medium text-gray-700">
            <FaNotesMedical className="text-blue-500" /> Problem Of Patient
          </label>
          <textarea
            className="border border-gray-300 rounded-lg w-full h-32 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
            placeholder="Describe the patient's condition and symptoms..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 w-72 py-4 text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Create Appointment
          </button>
        </div>
      </form>
    </div>
  );
}
