import { IoClose } from "react-icons/io5";

export default function VerifyLeaveModal({
  isOpen,
  onClose,
  onConfirm,
  counsellorName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  counsellorName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Confirm Leave Approval
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to approve the leave request for{" "}
          <b>{counsellorName}</b>?
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-100 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
