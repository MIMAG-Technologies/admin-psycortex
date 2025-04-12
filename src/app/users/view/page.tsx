"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaUser,
  FaVideo,
  FaCalendarAlt,
  FaComments,
  FaPhone,
  FaHandshake,
  FaHistory,
} from "react-icons/fa";

import { useLoading } from "@/context/LoadingContext";
import { getUserHistory, getIndividualUserHistory } from "@/utils/users";
import { AppointmentDetailModal } from "@/components/Users/AppointmentDetailModal";
import { AppointmentDetails } from "@/types/user";
import { UserDetails } from "@/types/user";
import { getUserDetails } from "@/utils/users";
import UserDetailedView from "@/components/Users/UserDetailedView";
import Loading from "@/components/Loading";

type HistoryItem = {
  id: number;
  user_id: string;
  user_details: { name: string; gender: string; age: number };
  counsellor_id: string;
  counsellor_name: string;
  session_id: string;
  session_type: "chat" | "call" | "video" | "in_person";
  created_at: string;
};

function UserViewPage() {
  const [history, setHistory] = useState<Array<HistoryItem>>([]);
  const [selectedDetails, setSelectedDetails] =
    useState<AppointmentDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userDetails, setuserDetails] = useState<null | UserDetails>(null);

  const searchParams = useSearchParams();
  const { setLoading } = useLoading();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchHistory = async () => {
      if (id) {
        setLoading(true);
        const res = await getUserHistory(id);
        setHistory(res);
        const res2 = await getUserDetails(id);
        setuserDetails(res2);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  const getSessionIcon = (type: HistoryItem["session_type"]) => {
    switch (type) {
      case "chat":
        return <FaComments className="text-purple-500 text-xl" />;
      case "call":
        return <FaPhone className="text-green-500 text-xl" />;
      case "video":
        return <FaVideo className="text-blue-500 text-xl" />;
      case "in_person":
        return <FaHandshake className="text-orange-500 text-xl" />;
      default:
        return null;
    }
  };

  const handleViewMore = async (sessionId: string | Number) => {
    setLoading(true);
    const details = await getIndividualUserHistory(String(sessionId));
    setSelectedDetails(details);
    setModalOpen(true);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {userDetails && <UserDetailedView user={userDetails} />}

      <div className={`rounded-xl border shadow-sm bg-indigo-50`}>
        <div className="px-5 py-4 border-b flex items-center gap-3 text-gray-800 font-semibold text-base">
          <FaHistory /> User History
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.length === 0 ? (
            <p className="text-gray-500">No history available for this user.</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="border bg-white border-slate-300 rounded-lg p-4 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <FaUser className="text-primary text-xl" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.user_details.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {item.user_details.gender}, {item.user_details.age} years
                      old
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getSessionIcon(item.session_type)}
                  <p className="text-gray-700">
                    Session Type:{" "}
                    <span className="font-medium">{item.session_type}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <FaCalendarAlt className="text-yellow-500 text-xl" />
                  <p className="text-gray-700">
                    Date:{" "}
                    <span className="font-medium">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    Time:{" "}
                    <span className="font-medium">
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-gray-700">
                    Counsellor:{" "}
                    <span className="font-medium">{item.counsellor_name}</span>
                  </p>
                </div>
                <button
                  className="mt-auto bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition"
                  onClick={() => handleViewMore(item.id)}
                >
                  View More
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <AppointmentDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedDetails}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading/>}>
      <UserViewPage />
    </Suspense>
  );
}