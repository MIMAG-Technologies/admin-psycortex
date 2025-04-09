import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import {
  FaRegCalendarAlt,
  FaMars,
  FaVenus,
  FaGenderless,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function OneUserCard(props: {
  profile_image: string;
  id: string;
  name: string;
  date_of_birth: string;
  gender: string;
}) {
  const ageCalculator = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Gender Icons Logic
const getGenderIcon = (gender: string | null | undefined) => {
  if (!gender) return <FaGenderless className="text-gray-500" />; // Handle missing values

  switch (gender.toLowerCase()) {
    case "male":
      return <FaMars className="text-blue-500" />;
    case "female":
      return <FaVenus className="text-pink-500" />;
    default:
      return <FaGenderless className="text-gray-500" />;
  }
};

const router = useRouter();


  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-slate-100 p-4 border border-slate-300 w-full sm:flex-nowrap">
      {/* Profile Image */}
      <img
        className="h-16 w-16 rounded-full object-cover border border-gray-400 sm:h-20 sm:w-20"
        src={props.profile_image}
        alt="User Profile"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/images/user-dummy-img.png";
        }}
      />

      {/* User Details */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">
          {props.name}
        </h3>

        <div className="flex flex-col sm:flex-row sm:gap-4">
          {/* Age */}
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FaRegCalendarAlt className="text-blue-500" />
            {ageCalculator(props.date_of_birth)} Years Old
          </p>

          {/* Gender */}
          <p className="text-sm text-gray-600 flex items-center gap-2 capitalize">
            {getGenderIcon(props.gender)}
            {props.gender}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full gap-2 sm:w-auto sm:ml-auto">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-primary transition hover:bg-primary hover:text-white sm:w-auto"
          onClick={() => {
            router.push(`/users/view?id=${props.id}`);
          }}
        >
          <AiOutlineEye className="h-5 w-5" />
          View
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary sm:w-auto"
          onClick={() => {
            router.push(`/users/create?id=${props.id}&mode=edit`);
          }}
        >
          <AiOutlineEdit className="h-5 w-5" />
          Edit
        </button>
      </div>
    </div>
  );
}
