import Link from "next/link";
import { BiPlus } from "react-icons/bi";
import { LuSettings2 } from "react-icons/lu";

export default function Button() {
  return (
    <div className="flex ml-auto gap-3">
      {/* Filters Button */}
      <Link
        href="#"
        className="rounded-md bg-primary px-4 py-2 text-white hover:bg-secondary flex items-center gap-1"
      >
        <LuSettings2 />
        Filters
      </Link>

      {/* Create Appointment Button */}
      <Link
        href="/appointments/create"
        className="rounded-md bg-primary px-4 py-2 text-white hover:bg-secondary flex items-center gap-1"
      >
        <BiPlus />
        Create Appointment
      </Link>
    </div>
  );
}
