"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/utils/users";
import OneUserCard from "@/components/Users/OneUserCard";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useLoading } from "@/context/LoadingContext";
import { BiPlus } from "react-icons/bi";

export default function Page() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const { setLoading } = useLoading();

  const [users, setUsers] = useState<{
    users: Array<any>;
    current_page: number;
    total_pages: number;
    success: boolean;
  }>({
    users: [],
    current_page: 1,
    total_pages: 0,
    success: false,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchUser = async () => {
        setLoading(true);
        const user = await fetchUsers(search, page);
        setUsers(user);
        setLoading(false);
      };
      fetchUser();
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [search, page]);

  // Function to handle search and reset page to 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page to 1 when search changes
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-4 border-slate-300 justify-center sm:justify-between">
        <h1 className="text-2xl w-full sm:w-fit font-bold text-gray-800 mr-auto text-center sm:text-left">
          Users
        </h1>

        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search User..."
          className="w-full sm:max-w-xs rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
        />

        {/* Create User Button */}
        <Link
          href="/users/create"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <BiPlus />
          Create User
        </Link>
      </div>

      {/* Users List */}
      <div className="flex flex-col gap-4">
        {users.users.map((user, index) => (
          <OneUserCard
            key={index}
            id={user.id}
            profile_image={user.profile_image}
            name={user.name}
            date_of_birth={user.date_of_birth}
            gender={user.gender}
          />
        ))}
      </div>

      {/* Pagination */}
      {users.total_pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="flex items-center gap-1 rounded-md border px-4 py-2 text-gray-700 transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <AiOutlineLeft /> Prev
          </button>

          <span className="flex items-center rounded-md bg-slate-200 px-4 py-2 text-gray-800 font-medium">
            Page {page} of {users.total_pages}
          </span>

          <button
            className="flex items-center gap-1 rounded-md border px-4 py-2 text-gray-700 transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === users.total_pages}
            onClick={() => setPage(page + 1)}
          >
            Next <AiOutlineRight />
          </button>
        </div>
      )}
    </div>
  );
}
