"use client";
import { useEffect, useState } from "react";
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
import { BranchesSelectionBar } from "@/components/ui/BranchesSelectionBar";
import { getUserRecords } from "@/utils/users";
import AppointmentModal from "@/components/Appointments/AppointmentModal";

export default function CreateAppointment() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [counsellor, setCounsellor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<{
    id: string;
    full_address: string;
    city: string;
  }>({
    id: "",
    full_address: "",
    city: "",
  });
  const [description, setDescription] = useState("");
  const [prevousRecord, setprevousRecord] = useState<{
    counsellor_id: string;
    counsellor_name: string;
    date_time: string;
    duration: number;
    location: {
      id: string;
      city: string;
      full_address: string;
    };
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // if (validateForm()) {
    //   const formData: AppointmentFormData = {
    //     user,
    //     counsellor,
    //     date,
    //     time,
    //     duration,
    //     location,
    //     description,
    //   };
    //   console.log("Form Submitted", formData);
    //   toast.success("Appointment Created Successfully!");
    //   // Reset the form
    //   setUser("");
    //   setCounsellor("");
    //   setDate("");
    //   setTime("");
    //   setDuration("");
    //   setLocation("");
    //   setDescription("");
    // }
  };

  useEffect(() => {
    const fetchPrevousRecords = async () => {
      const records = await getUserRecords(user);
      if (records !== null) {
        setprevousRecord({
          counsellor_id: records.counsellor_id,
          counsellor_name: records.counsellor_name,
          date_time: records.date_time,
          duration: records.duration,
          location: {
            id: records.location.location_id,
            city: records.location.city,
            full_address: records.location.full_address,
          },
        });
        setIsOpen(true);
      }
    };
    if (user !== "") {
      fetchPrevousRecords();
    }
  }, [user]);

  function handleYes(): void {
    if (prevousRecord) {
      setCounsellor(prevousRecord.counsellor_id);
      setDuration(prevousRecord.duration.toString());
      setLocation({
        id: prevousRecord.location.id,
        full_address: prevousRecord.location.full_address,
        city: prevousRecord.location.city,
      });
      setIsOpen(false);
      toast.success("Previous appointment details loaded");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 p-4">
      <AppointmentModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        record={prevousRecord}
        onYes={handleYes}
      />
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
                <UserSelectionBar value={user} setValue={setUser} />
              </div>

              <div className="col-span-1">
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaUserMd className="mr-2 text-secondary" />
                  <span>Counsellor</span>
                </label>
                <CounsellorSelectionBar
                  value={counsellor}
                  setValue={setCounsellor}
                  isDisabled={user === ""}
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
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="border border-gray-300 rounded-md w-full px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white shadow-sm"
                >
                  <option value="" disabled>
                    Select Duration
                  </option>
                  <option value="45">45 Minutes</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-secondary" />
                  <span>Location</span>
                </label>
                <BranchesSelectionBar
                  value={location}
                  setValue={setLocation}
                  isDisabled={counsellor === ""}
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
