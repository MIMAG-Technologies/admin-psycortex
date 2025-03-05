import { FaUser, FaUserMd, FaCalendar, FaVideo, FaCheckCircle, FaTimesCircle, FaClock, FaNotesMedical } from "react-icons/fa";
import AppointmentCardProps from "@/types/appointments";

export default function AppointmentCard({
  user_name,
  counsellor_name,
  scheduled_at,
  mode,
  status,
  notes,
}: AppointmentCardProps) {
  return (
    <div className="border border-gray-300 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg w-full max-w-xl bg-white">
      <div className="flex items-center gap-4 mb-4">
        <img src="/images/user-dummy-img.png" alt="Profile" width={56} height={56} className="w-14 h-14 rounded-full" />

        <div className="space-y-1 flex-1">
          <div className="flex items-center text-gray-900 font-semibold">
            <FaUser className="text-blue-500 mr-2" />
            {user_name}
          </div>
          <div className="flex items-center text-gray-700">
            <FaUserMd className="text-gray-500 mr-2" />
            {counsellor_name}
          </div>
        </div>

        {/* Conditionally render the cancel button */}
        {status !== "Completed" && (
          <button className="bg-red-400 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-300 hover:bg-red-600 shadow-md hover:scale-105">
            Cancel
          </button>
        )}
      </div>

      <hr className="border-gray-300 mb-4" />

      <div className="grid grid-cols-2 gap-4 mb-4 text-gray-700">
        <DetailItem label="Date" icon={FaCalendar} text={scheduled_at.split(" ")[0]} color="text-blue-500" />
        <DetailItem label="Time" icon={FaClock} text={scheduled_at.split(" ")[1]} color="text-blue-500" />
        <DetailItem label="Mode" icon={FaVideo} text={mode} color="text-gray-500" />
        <div className="flex flex-col">
          <span className="text-gray-800 font-semibold">Status</span>
          <div className="flex items-center">
            {status === "Completed" ? (
              <FaCheckCircle className="text-green-500 mr-2" />
            ) : (
              <FaTimesCircle className="text-yellow-500 mr-2" />
            )}
            <span className={status === "Completed" ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {notes && (
        <>
          <hr className="border-gray-300 mb-4" />
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
            <div className="flex items-center text-gray-800 font-medium mb-1">
              <FaNotesMedical className="text-gray-500 mr-2" />
              Notes
            </div>
            <p className="text-gray-700">{notes}</p>
          </div>
        </>
      )}
    </div>
  );
}

const DetailItem = ({ label, icon: Icon, text, color }: { label: string; icon: any; text: string; color: string }) => (
  <div className="flex flex-col">
    <span className="text-gray-800 font-semibold">{label}</span>
    <div className="flex items-center gap-2">
      <Icon className={color} />
      <span className="text-gray-800">{text}</span>
    </div>
  </div>
);