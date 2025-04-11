import {
  FaUser,
  FaUserMd,
  FaCalendar,
  FaVideo,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaNotesMedical,
  FaLink,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { CancleSchedule } from "@/utils/appointments";
import { toast } from "react-toastify";
import { useLoading } from "@/context/LoadingContext";
type SessionMode = "chat" | "counselling" | "offline";

interface Session {
  id: string;
  user_name: string;
  user_id: string;
  counsellor_name: string;
  counsellor_id: string;
  scheduled_at: string;
  mode: SessionMode;
  notes: string;
  status: string;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  cancellation?: {
    by: string;
    at: string;
    reason: string;
  } | null;
  attendance?: {
    user_joined: boolean;
    counsellor_joined: boolean;
  };
  link?: string | null;
}
export default function AppointmentCard({
  user_name,
  user_id,
  counsellor_name,
  counsellor_id,
  scheduled_at,
  mode,
  status,
  cancellation,
  notes,
  link,
}: Session) {
    const { setLoading } = useLoading();
  const handleCancel = async () => {
    setLoading(true);
    if (confirm("Are you sure you want to cancel this appointment?")) {
      const res = await CancleSchedule(
        user_id,
        counsellor_id,
        scheduled_at,
      )
      if(!res){
        toast.error("Error in cancelling appointment")
        setLoading(false);
        return;
      }
      toast.success("Appointment cancelled successfully");
    }
    setLoading(false);
  };

  return (
    <div className="border border-gray-300 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg w-full max-w-xl bg-white">
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/images/user-dummy-img.png"
          alt="Profile"
          width={56}
          height={56}
          className="w-14 h-14 rounded-full"
        />

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
      </div>

      <hr className="border-gray-300 mb-4" />

      <div className="grid grid-cols-2 gap-4 mb-4 text-gray-700">
        <DetailItem
          label="Date"
          icon={FaCalendar}
          text={new Date(scheduled_at.split(" ")[0]).toLocaleDateString('en-GB')}
          color="text-blue-500"
        />
        <DetailItem
          label="Time"
          icon={FaClock}
          text={new Date(`2000-01-01 ${scheduled_at.split(" ")[1]}`).toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
          })}
          color="text-blue-500"
        />
        <DetailItem
          label="Mode"
          icon={FaVideo}
          text={mode}
          color="text-gray-500"
        />
        <DetailItem
          label="Status"
          icon={
        status === "completed"
          ? FaCheckCircle
          : status === "upcoming" || status === "scheduled"
          ? FaCalendar
          : status === "ongoing"
          ? FaClock
          : status === "cancelled" || "missed"
          ? FaTimesCircle
          : FaTimesCircle // for expired
          }
          text={status}
          color={
        status === "completed"
          ? "text-green-500"
          : status === "upcoming"
          ? "text-blue-500"
          : status === "ongoing"
          ? "text-yellow-500"
          : status === "cancelled" || "missed"
          ? "text-red-500"
          : "text-gray-500" // for expired
          }
        />
      </div>
      <hr className="border-gray-300 mb-4" />
      <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
        <div className="flex items-center text-gray-800 font-medium mb-1">
          <FaNotesMedical className="text-gray-500 mr-2" />
          Description
        </div>
        <p className="text-gray-700">{notes ? notes : "No notes available"}</p>
      </div>
      {mode !== "chat" && <hr className="border-gray-300 my-4" />}

      {link && (
        <DetailItem
          label={mode === "counselling" ? "Join Link" : "Location"}
          icon={mode === "counselling" ? FaLink : FaMapMarkerAlt}
          text={link}
          color="text-blue-500"
        />
      )}
      {mode === "offline" && (
        <button
          className={` text-white px-4 py-2 rounded-md mt-4 w-full ${
            cancellation !== null || new Date(scheduled_at) < new Date()
              ? "opacity-90 cursor-not-allowed bg-gray-500"
              : "hover:bg-red-600 bg-red-500"
          }`}
          disabled={cancellation !== null || new Date(scheduled_at) < new Date()}
          onClick={() => handleCancel()}
        >
          Cancel Appointment
        </button>
      )}
    </div>
  );
}

const DetailItem = ({
  label,
  icon: Icon,
  text,
  color,
}: {
  label: string;
  icon: IconType;
  text: string;
  color: string;
}) => (
  <div className="flex flex-col">
    <span className="text-gray-800 font-semibold">{label}</span>
    <div className="flex items-center gap-2">
      <Icon className={color} />
      <span className="text-gray-800">{text}</span>
    </div>
  </div>
);
