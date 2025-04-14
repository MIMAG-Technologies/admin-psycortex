"use client";

import { useLoading } from "@/context/LoadingContext";
import { useEffect, useState } from "react";
import {
  FaVideo,
  FaCommentDots,
  FaPhoneAlt,
  FaUserCheck,
  FaDollarSign,
} from "react-icons/fa";
import { MdOutlineLocalActivity } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";
import VariablesPage from "@/components/Counsellors/VariablesPage";
import { getAllCounsellorOverview } from "@/utils/payments";
type SimplifiedCounsellor = {
  id: string;
  personalInfo: {
    name: string;
    profileImage: string;
  };
  professionalInfo: {
    title: string;
    yearsOfExperience: number;
  };
};

export default function CounsellorEarning() {
  const { setLoading } = useLoading();
  const [counsellors, setCounsellors] = useState<Array<SimplifiedCounsellor>>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCounsellorData = async () => {
      setLoading(true);
      const res = await getAllCounsellorOverview();
      setCounsellors(res);
      setLoading(false);
    };
    fetchCounsellorData();
  }, [setLoading]);

  const filteredCounsellors = counsellors.filter((counsellor) =>
    counsellor.personalInfo.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <VariablesPage />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-10 flex justify-around items-center gap-2">
        <h1 className="text-2xl font-semibold  text-center text-indigo-600">
          Counsellor Earnings
        </h1>

        {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by counsellor name"
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCounsellors.length > 0 ? (
            filteredCounsellors.map((counsellor) => (
              <OneCounsellorCard
                key={counsellor.id}
                counsellor={counsellor}
                router={router}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No counsellors match your search.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function OneCounsellorCard({
  counsellor,
  router,
}: {
  counsellor: SimplifiedCounsellor;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform hover:scale-105 p-5">
      <div className="flex items-center gap-4">
        <img
          src={
            counsellor.personalInfo.profileImage || "/images/user-dummy-img.png"
          }
          alt={counsellor.personalInfo.name}
          width={60}
          height={60}
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h2 className="text-lg font-semibold">
            {counsellor.personalInfo.name}
          </h2>
          <p className="text-gray-500 text-sm">
            {counsellor.professionalInfo.title}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition"
          onClick={() => {
            router.push(`/payments/counsellor?id=${counsellor.id}`);
          }}
        >
          View Earning
        </button>
      </div>
    </div>
  );
}
