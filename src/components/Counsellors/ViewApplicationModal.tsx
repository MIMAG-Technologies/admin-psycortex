import { IoClose, IoCheckmarkCircle, IoTrash } from "react-icons/io5";

export default function ViewApplicationModal({
  isOpen,
  onClose,
  counsellor,
  onVerify,
}: {
  isOpen: boolean;
  onClose: () => void;
  counsellor: any;
  onVerify: (id: string) => void;
}) {
  if (!isOpen || !counsellor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {counsellor.personalInfo.name}
        </h2>
        <p className="text-gray-600 mb-2">
          <b>Email:</b> {counsellor.personalInfo.email}
        </p>
        <p className="text-gray-600 mb-2">
          <b>Phone:</b> {counsellor.personalInfo.phone}
        </p>
        <p className="text-gray-600 mb-2">
          <b>Title:</b> {counsellor.professionalInfo.title}
        </p>
        <p className="text-gray-600 mb-4">
          <b>Experience:</b> {counsellor.professionalInfo.yearsOfExperience}{" "}
          years
        </p>

        <p className="text-gray-600 text-sm mb-6">
          <b>Note:</b> Entire Data with Attached Documents is Sent to Your Mail.
          Please Refer to That.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => onVerify(counsellor.id)}
            className="flex  w-[48%] items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-100 transition"
          >
            <IoCheckmarkCircle size={18} />
            Verify
          </button>

          <button
            onClick={() => alert("Application Rejected")}
            className="flex w-[48%]  items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-100 transition"
          >
            <IoTrash size={18} />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
