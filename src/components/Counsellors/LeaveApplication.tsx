import { IoEye } from "react-icons/io5";

interface LeaveApplicationProps {
  name: string;
  leaveStart: string;
  message: string;
  leaveTill: string | null;
}

// Truncate message to 100 characters
const truncateMessage = (message: string) => {
  return message.length > 100 ? message.slice(0, 100) + "..." : message;
};

export default function LeaveApplication({
  name,
  leaveStart,
  message,
  leaveTill,
}: LeaveApplicationProps) {
  return (
    <div className="border bg-slate-100 border-slate-300 rounded-lg p-5 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition">
      {/* Profile Image */}
      <img
        src="/images/user-dummy-img.png"
        alt={name}
        className="w-20 h-20 rounded-full object-cover border border-gray-300"
      />

      {/* Leave Details */}
      <div className="flex-1 space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">
          Leave From: <span className="font-medium">{leaveStart}</span>
        </p>
        <p className="text-sm text-gray-600">
          Leave Till: <span className="font-medium">{leaveTill || "Not Specified"}</span>
        </p>
        <p className="text-sm text-gray-600">
          Message: <span className="font-medium">{truncateMessage(message)}</span>
        </p>
      </div>
    </div>
  );
}
