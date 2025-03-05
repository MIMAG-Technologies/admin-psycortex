import { IoClose, IoCheckmarkCircle, IoTrash } from "react-icons/io5";

export default function ViewLeaveModal({
  isOpen,
  onClose,
  application,
  onVerify,
}: {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  onVerify: (id: string) => void;
}) {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
        >
          <IoClose size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Leave Application - {application.name}
        </h2>

        {/* Leave Details */}
        <p className="text-gray-600 mb-2">
          <b>Title:</b> {application.title}
        </p>
        <p className="text-gray-600 mb-2">
          <b>Leave From:</b> {application.leaveStart}
        </p>
        <p className="text-gray-600 mb-2">
          <b>Leave Till:</b> {application.leaveTill}
        </p>

        {/* Scrollable Message */}
        <div className="application-leave-message-box max-h-40 overflow-y-auto bg-gray-100 p-3 rounded-md text-gray-700 mb-4">
          <b>Message:</b> {application.message}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => onVerify(application.id)}
            className="flex items-center gap-2 w-[49%] px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-100 transition"
          >
            <IoCheckmarkCircle size={18} />
            Verify
          </button>

          <button
            onClick={onClose} // Close the modal on rejection
            className="flex items-center gap-2 w-[49%] px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-100 transition"
          >
            <IoTrash size={18} />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
