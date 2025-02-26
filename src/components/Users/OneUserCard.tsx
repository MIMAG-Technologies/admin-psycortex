import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import {
  FaRegCalendarAlt,
  FaMars,
  FaVenus,
  FaGenderless,
} from "react-icons/fa";

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
  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return <FaMars className="text-blue-500" />;
      case "female":
        return <FaVenus className="text-pink-500" />;
      default:
        return <FaGenderless className="text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-row items-center gap-4 rounded-lg bg-slate-100 p-4 border border-slate-300 w-full flex-nowrap">
      {/* Profile Image */}
      <img
        className="h-16 w-16 rounded-full object-cover border border-gray-400"
        src={props.profile_image}
        alt="User Profile"
      />

      {/* User Details */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">
          {props.name}
        </h3>

        <div className="flex gap-4">
          {/* Age */}
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FaRegCalendarAlt className="text-blue-500" />
            {ageCalculator(props.date_of_birth)} Years Old
          </p>

          {/* Gender */}
          <p className="text-sm text-gray-600 flex items-center gap-2">
            {getGenderIcon(props.gender)}
            {props.gender.charAt(0).toUpperCase() + props.gender.slice(1)}
          </p>
        </div>
      </div>

      {/* Action Buttons (Aligned to Right) */}
      <div className="flex gap-2 sm:ml-auto">
        <button
          className="flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-primary transition hover:bg-primary hover:text-white"
          onClick={() => console.log(props.id)}
        >
          <AiOutlineEye className="h-5 w-5" />
          View
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary"
          onClick={() => console.log(props.id)}
        >
          <AiOutlineEdit className="h-5 w-5" />
          Edit
        </button>
      </div>
    </div>
  );
}
