"use client";
import { useState } from "react";
import {
  FaUser,
  FaUserMd,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserSelectionBar } from "@/components/ui/UserSelectionBar";
import { CounsellorSelectionBar } from "@/components/ui/CounsellorSelectionBar";


export default function CreateAppointment() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [counsellor, setCounsellor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

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
    if (!duration) {
      toast.error("Please set duration");
      return false;
    }
    if (!location) {
      toast.error("Please enter a location");
      return false;
    }
    if (!description) {
      toast.error("Please enter a description");
      return false;
    }
    return true;
  };

  interface AppointmentFormData {
    user: string;
    counsellor: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    description: string;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      const formData: AppointmentFormData = {
        user,
        counsellor,
        date,
        time,
        duration,
        location,
        description,
      };
      console.log("Form Submitted", formData);
      toast.success("Appointment Created Successfully!");
      // Reset the form
      setUser("");
      setCounsellor("");
      setDate("");
      setTime("");
      setDuration("");
      setLocation("");
      setDescription("");
    }
  };





  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 p-4">
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden"
        style={{ minHeight: "550px", width: "700px" }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-center text-slate-800 w-full tracking-tight">
            Create An Offline Appointment
          </h2>

          <button
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => router.back()}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="font-sans">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div className="col-span-1">
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaUser className="mr-2 text-primary" />
                  <span>User</span>
                </label>
                <UserSelectionBar
                  value={user}
                  setValue={setUser}
                />
              </div>

              <div className="col-span-1">
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaUserMd className="mr-2 text-secondary" />
                  <span>Counsellor</span>
                </label>
                <CounsellorSelectionBar 
                value={counsellor}
                setValue={setCounsellor}
                />
              </div>

              <div className="col-span-1">
                <label className=" text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaCalendar className="mr-2 text-primary" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md w-full px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white shadow-sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="col-span-1">
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaClock className="mr-2 text-secondary" />
                  <span>Time Slot</span>
                </label>
                <input
                  type="time"
                  className="border border-gray-300 rounded-md w-full px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white shadow-sm"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="col-span-1">
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaClock className="mr-2 text-secondary" />
                  <span>Duration</span>
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md w-full px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white shadow-sm"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Set Duration in Minutes"
                />
              </div>

              <div className="col-span-1">
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-secondary" />
                  <span>Location</span>
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md w-full px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white shadow-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter appointment location"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                <FaNotesMedical className="mr-2 text-primary" />
                <span>Description</span>
              </label>
              <textarea
                className="border border-gray-300 rounded-md w-full px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white shadow-sm"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the appointment"
              />
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-md font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm"
              >
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
