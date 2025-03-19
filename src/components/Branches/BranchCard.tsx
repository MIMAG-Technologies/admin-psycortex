import { FaCity } from "react-icons/fa";
import { FaMountainCity, FaTreeCity } from "react-icons/fa6";
import { MdLocationCity } from "react-icons/md";
import { GiModernCity } from "react-icons/gi";
import { PiCityFill } from "react-icons/pi";
import { LiaCitySolid } from "react-icons/lia";
import { IoPencil, IoTrash } from "react-icons/io5";

// Array of city icons (random selection)
const cityIcons = [
  <FaCity />,
  <FaMountainCity />,
  <FaTreeCity />,
  <MdLocationCity />,
  <GiModernCity />,
  <PiCityFill />,
  <LiaCitySolid />,
];
 type Branch = {
   id: string;
   city: string;
   full_address: string;
   onDelete: (id: string) => void;
 };


export default function BranchCard({
  id,
  city,
  full_address,
  onDelete,
}: Branch) {
  const randomIcon = cityIcons[Math.floor(Math.random() * cityIcons.length)];

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm hover:shadow-md transition w-full sm:w-[350px] flex flex-col">
      {/* City Icon & Name */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full text-2xl">
          {randomIcon}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{city}</h2>
      </div>

      {/* Full Address */}
      <p className="text-gray-500 text-sm mt-2 mb-auto">
        <b>Address:</b> {full_address}
      </p>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        
        <button
          onClick={() => onDelete(id)}
          className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-100 transition w-full"
        >
          <IoTrash size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}
