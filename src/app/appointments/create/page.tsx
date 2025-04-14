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
import { BookSchedule, getCounsellorSchedule } from "@/utils/appointments";
import { useLoading } from "@/context/LoadingContext";

export default function CreateAppointment() {
  const router = useRouter();
  const { setLoading } = useLoading();

  const [mode, setMode] = useState<"individual" | "couple">("individual");

  const [user, setUser] = useState("");
  const [user2, setUser2] = useState("");

  const [counsellor, setCounsellor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("45");
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [workingHours, setworkingHours] = useState<Array<any>>([]);
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

  useEffect(() => {
    setDuration(mode === "individual" ? "45" : "90");
  }, [mode]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const schedule = await getCounsellorSchedule(counsellor, date);
      setworkingHours(schedule);
    };
    if (date !== "" && counsellor !== "") {
      setLoading(true);
      fetchSchedule();
      setLoading(false);
    }
  }, [date]);

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
            id: records.location.id,
            city: records.location.city,
            full_address: records.location.full_address,
          },
        });
        setIsOpen(true);
      }
    };
    if (user !== "") {
      setLoading(true);
      fetchPrevousRecords();
      setLoading(false);
    }
  }, [user]);

  function handleYes(): void {
    if (prevousRecord) {
      setCounsellor(prevousRecord.counsellor_id);
      setLocation({
        id: prevousRecord.location.id,
        full_address: prevousRecord.location.full_address,
        city: prevousRecord.location.city,
      });
      setIsOpen(false);
      toast.success("Previous appointment details loaded");
    }
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);


    if (
      !user ||
      (mode === "couple" && !user2) ||
      !counsellor ||
      !date ||
      !time ||
      !duration ||
      !location
    ) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const res = await BookSchedule(
      user,
      user2,
      mode,
      counsellor,
      date + " " + time,
      description,
      location.id,
      duration
    );

    if (!res) {
      toast.error("Error booking appointment");
      setLoading(false);
      return;
    }

    toast.success("Appointment booked successfully");
    setLoading(false);
    router.push(`/appointments`);
  };

  useEffect(() => {
    if( user !== "" && user2 === user){
      toast.error("User and partner cannot be the same person.");
      setUser2("");
    }

  }, [user2])
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 p-4">
      <AppointmentModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        record={prevousRecord}
        onYes={handleYes}
      />

      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-y-auto"
        style={{ minHeight: "550px", maxHeight: "90vh", width: "700px" }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
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

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mt-4 px-6 w-full">
          <button
            type="button"
            onClick={() => setMode("individual")}
            className={`px-4 py-2 w-1/2 rounded-md text-sm font-semibold ${
              mode === "individual"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Individual Counselling
          </button>
          <button
            type="button"
            onClick={() => setMode("couple")}
            className={`px-4 py-2 w-1/2 rounded-md text-sm font-semibold ${
              mode === "couple"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Couple Counselling
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

              {mode === "couple" && (
                <div className="col-span-1">
                  <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                    <FaUser className="mr-2 text-primary" />
                    <span>Partner</span>
                  </label>
                  <UserSelectionBar value={user2} setValue={setUser2} />
                </div>
              )}

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
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaCalendar className="mr-2 text-primary" />
                  <span>Date</span>
                </label>
                <input
                  disabled={counsellor === ""}
                  type="date"
                  className="border border-gray-300 rounded-md w-full px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white shadow-sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  max={
                    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="text-sm font-semibold mb-1.5 text-gray-800 flex items-center">
                  <FaClock className="mr-2 text-secondary" />
                  <span>Time Slot</span>
                </label>
                <select
                  className="border border-gray-300 rounded-md w-full px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white shadow-sm"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  {date === "" ? (
                    <option value="" disabled>
                      Select Date first
                    </option>
                  ) : 
                  workingHours.length === 0 ? (
                    <option value="" disabled>
                      No available time slots
                    </option>
                  ) :
                  (
                    <option value="" disabled>
                      Select Time
                    </option>
                  )}
                  {workingHours.map((timeSlot) => (
                    <option key={timeSlot.time} value={timeSlot.time}>
                      {new Date(
                        `2000-01-01T${timeSlot.time}`
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </option>
                  ))}
                </select>
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
                  <option value={duration}>{duration} Minutes</option>
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
