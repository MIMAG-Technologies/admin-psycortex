"use client";
import { useLoading } from "@/context/LoadingContext";
import { getUserHistory } from "@/utils/users";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaUser, FaVideo, FaCalendarAlt, FaComments, FaPhone, FaHandshake } from "react-icons/fa";

type HistoryItem = {
  id: number;
  user_id: string;
  user_details: {
    name: string;
    gender: string; 
    age: number;
  };
  counsellor_id: string;
  counsellor_name: string;
  session_id: string;
  session_type: "chat" | "call" | "video" | "in_person";
  created_at: string;
};

export default function Page() {
  const [history, setHistory] = useState<Array<HistoryItem>>([]);
  const searchParams = useSearchParams();
  const { setLoading } = useLoading();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchHistory = async () => {
      if (id) {
        setLoading(true);
        const res = await getUserHistory(id);
        setHistory(res);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  const getSessionIcon = (type: "chat" | "call" | "video" | "in_person") => {
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

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User History</h1>
      <div className="flex flex-col gap-4">
        {history.length === 0 ? (
          <p className="text-gray-500">No history available for this user.</p>
        ) : (
          history.map((item) => (
          <div
            key={item.id}
            className=" border bg-slate-100 border-slate-300 rounded-lg p-4 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <FaUser className="text-primary text-xl" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.user_details.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {item.user_details.gender}, {item.user_details.age} years old
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
              onClick={() =>
                alert(`Viewing more details for session ${item.session_id}`)
              }
            >
              View More
            </button>
          </div>
        )))}
      </div>
    </div>
  );
}
