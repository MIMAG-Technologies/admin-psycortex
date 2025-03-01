import { IoEye, IoCheckmarkCircle } from "react-icons/io5";

interface Application {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  profileImage: string;
  title: string;
  onViewApplication: (id: string) => void;
  onVerify: (id: string) => void;
}

// Function to calculate age from date of birth
const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export default function ApplicationCard({
  id,
  name,
  dateOfBirth,
  gender,
  profileImage,
  title,
  onViewApplication,
  onVerify,
}: Application) {
  return (
    <div className="border bg-slate-100 border-slate-300 rounded-lg p-5 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition">
      {/* Profile Image */}
      <img
        src={profileImage}
        alt={name}
        className="w-20 h-20 rounded-full object-cover border border-gray-300"
      />

      {/* Counsellor Details */}
      <div className="flex-1 space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">
          {name} <span className="text-gray-500">({title})</span>
        </h2>
        <p className="text-sm text-gray-600">
          Age:{" "}
          <span className="font-medium">{calculateAge(dateOfBirth)} years</span>
        </p>
        <p className="text-sm text-gray-600">
          Gender: <span className="font-medium">{gender}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onViewApplication(id)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white  rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <IoEye className="text-blue-600" size={18} />
          View Application
        </button>

        <button
          onClick={() => onVerify(id)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white  rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <IoCheckmarkCircle className="text-green-600" size={18} />
          Verify
        </button>
      </div>
    </div>
  );
}
