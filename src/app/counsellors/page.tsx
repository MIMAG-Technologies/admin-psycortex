import Link from "next/link";
import { BiPlus } from "react-icons/bi";

export default function Page() {

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-4 border-slate-300 justify-center sm:justify-between">
        <h1 className="text-2xl w-full sm:w-fit font-bold text-gray-800 mr-auto text-center sm:text-left">
          Counsellors
        </h1>
        <Link
          href="/counsellors/create"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <BiPlus />
          Create Counsellor
        </Link>
      </div>
    </div>
  );
}
