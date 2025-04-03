"use client";
import { useLoading } from "@/context/LoadingContext";
import { createDiscount } from "@/utils/tests";
import { createUser } from "@/utils/users";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

export default function DiscountForm() {
  const [formData, setFormData] = useState({
    name: "",
    discountPercent: "",
    expiresOn: "",
    description: "",
  });
  const { setLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.discountPercent ||
      !formData.description ||
      !formData.expiresOn
    ) {
      return toast.error("Please fill all the fields");
    }

    setLoading(true);

    const res = await createDiscount({
      ...formData,
      discountPercent: Number(formData.discountPercent),
    });
    if (res) {
      toast.success("Discount offer created successfully!");
      setLoading(false);
      router.back();
    }
    toast.error("Error creating discount offer");
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
          Create Discount Offer
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

          {/* discountPercent */}
          <div className="mb-4">
            <label
              htmlFor="discountPercent"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Discount (in %)
            </label>
            <input
              type="number"
              id="discountPercent"
              name="discountPercent"
              value={formData.discountPercent}
              onChange={(e) =>
                setFormData({ ...formData, discountPercent: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
              placeholder="Enter Discount Percent"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="expiresOn"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Expires On
            </label>
            <input
              type="datetime-local"
              id="expiresOn"
              name="expiresOn"
              value={formData.expiresOn}
              onChange={(e) =>
                setFormData({ ...formData, expiresOn: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
            />
          </div>
          {/* description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-outline focus:outline-none focus:ring-1 focus:ring-outline"
              placeholder="Enter your description"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-outline focus:ring-offset-2"
          >
            Create Discount Offer
          </button>
        </form>
      </div>
    </div>
  );
}
