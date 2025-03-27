"use client";

import { useEffect, useState } from "react";
import AppointmentCard from "@/components/Appointments/AppointmentCard";
import { getAppointments } from "@/utils/appointments";
import { useLoading } from "@/context/LoadingContext";
import Link from "next/link";
import { LuSettings2 } from "react-icons/lu";
import { BiPlus } from "react-icons/bi";

export default function AppointmentManagement() {
  type SessionMode = "chat" | "counselling" | "offline";
  type StatusType =
    | "upcoming"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "expired"
    | "missed";

  const { setLoading } = useLoading();

  interface Session {
    id: string;
    user_name: string;
    user_id: string;
    counsellor_name: string;
    counsellor_id:string;
    scheduled_at: string;
    mode: SessionMode;
    notes: string;
    status: StatusType;
    created_at: string;
    started_at: string | null;
    ended_at: string | null;
    cancellation?: {
      by: string;
      at: string;
      reason: string;
    } | null;
    attendance?: {
      user_joined: boolean;
      counsellor_joined: boolean;
    };
    link?: string | null;
  }

  const [appointments, setAppointments] = useState<Session[]>([]);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    mode: "offline" as SessionMode, // Default mode is offline
    happened: "all" as "all" | "yes" | "no",
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_results: 1,
    results_per_page: 20,
  });

  const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility

  const fetchAppointments = async () => {
    setLoading(true);
    const res = await getAppointments({
      page: pagination.current_page,
      from: filters.from,
      to: filters.to,
      mode: filters.mode,
      happened:
        filters.happened === "all" ? undefined : filters.happened === "yes",
    });

    setAppointments(res.appointments || []);
    setPagination(res.pagination || pagination);
    setLoading(false);
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 })); // Reset to page 1 on filter change
    fetchAppointments();
  }, [filters]);

  useEffect(() => {
    fetchAppointments();
  }, [pagination.current_page]);

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      from: "",
      to: "",
      mode: "offline",
      happened: "all",
    });
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };
  

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-6 gap-4">
        <h1 className="text-2xl font-semibold">All Appointments</h1>
        <div className="flex gap-3 flex-wrap">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-secondary flex items-center gap-2 w-full md:w-fit"
          >
            <LuSettings2 />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Create Appointment Button */}
          <Link
            href="/appointments/create"
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-secondary flex items-center gap-2 w-full md:w-fit"
          >
            <BiPlus />
            Create Appointment
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showFilters ? "md:max-h-60 max-h-120 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap gap-4 mb-6 bg-gray-100 p-4 rounded-md">
          {/* From Date */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium">From:</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          {/* To Date */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium">To:</label>
            <input
              type="date"
              value={filters.to}
              max={new Date().toISOString().split("T")[0]} // Constraint: To can't be after today
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          {/* Mode Select */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium">Mode:</label>
            <select
              value={filters.mode}
              onChange={(e) =>
                setFilters({ ...filters, mode: e.target.value as SessionMode })
              }
              className="border px-3 py-2 rounded-md w-full"
            >
              <option value="offline">Offline</option>
              <option value="chat">Chat</option>
              <option value="counselling">Video</option>
            </select>
          </div>

          {/* Happened Select */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium">Happened:</label>
            <select
              value={filters.happened}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  happened: e.target.value as "all" | "yes" | "no",
                })
              }
              className="border px-3 py-2 rounded-md w-full"
            >
              <option value="all">All</option>
              <option value="yes">Happened</option>
              <option value="no">Not Happened</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className="px-4 py-3 bg-gray-300 rounded-md hover:bg-gray-400 h-fit my-auto"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Appointment List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1 w-full">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} {...appointment} />
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-3">
            No appointments found
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-3">
        <button
          disabled={pagination.current_page === 1}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              current_page: prev.current_page - 1,
            }))
          }
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded-md">
          Page {pagination.current_page} of {pagination.total_pages}
        </span>
        <button
          disabled={pagination.current_page === pagination.total_pages}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              current_page: prev.current_page + 1,
            }))
          }
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
