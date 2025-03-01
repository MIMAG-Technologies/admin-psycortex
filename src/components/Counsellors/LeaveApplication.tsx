import { IoEye, IoCheckmarkCircle } from "react-icons/io5";

interface LeaveApplicationProps {
  id: string;
  name: string;
  title: string;
  profilePhoto: string;
  leaveTill: string;
  message: string;
  onViewApplication: (id: string) => void;
  onVerify: (id: string) => void;
}

// Truncate message to 100 characters
const truncateMessage = (message: string) => {
  return message.length > 100 ? message.slice(0, 100) + "..." : message;
};

export default function LeaveApplication({
  id,
  name,
  title,
  profilePhoto,
  leaveTill,
  message,
  onViewApplication,
  onVerify,
}: LeaveApplicationProps) {
  return (
    <div className="border bg-slate-100 border-slate-300 rounded-lg p-5 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition">
      {/* Profile Image */}
      <img
        src={profilePhoto}
        alt={name}
        className="w-20 h-20 rounded-full object-cover border border-gray-300"
      />

      {/* Leave Details */}
      <div className="flex-1 space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">
          {name} <span className="text-gray-500">({title})</span>
        </h2>
        <p className="text-sm text-gray-600">
          Leave Till: <span className="font-medium">{leaveTill}</span>
        </p>
        <p className="text-sm text-gray-600">
          Message:{" "}
          <span className="font-medium">{truncateMessage(message)}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onViewApplication(id)}
          className="flex items-center gap-2 px-4 py-2 border bg-white border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <IoEye className="text-blue-600" size={18} />
          View Application
        </button>

        <button
          onClick={() => onVerify(id)}
          className="flex items-center gap-2 px-4 py-2 border bg-white border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <IoCheckmarkCircle className="text-green-600" size={18} />
          Verify
        </button>
      </div>
    </div>
  );
}
