"use client";
import { useLoading } from "@/context/LoadingContext";
import { createUser } from "@/utils/users";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  });
  const { setLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const is_created = await createUser(formData.name, formData.email, formData.phone, formData.date_of_birth , formData.gender);
    if (is_created) {
      alert("User created successfully!");
      setLoading(false);
      router.back();
    } else {
      alert("Failed to create user. Please try again.");
    }
    setLoading(false);
    
    
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      onClick={() => router.back()} // Click outside to close
    >
      <div
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
      >
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <AiOutlineClose className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-700">
          Create User
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label
              htmlFor="date_of_birth"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-outline focus:ring-offset-2"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
