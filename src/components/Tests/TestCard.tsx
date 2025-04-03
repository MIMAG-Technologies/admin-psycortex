"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TestProps {
  test: {
    name: string;
    slug: string;
    imageUrl?: string;
    description: string;
    shortDescription?: string;
    benefits: string[];
    details: {
      durationMinutes: number;
      totalQuestions: number;
      minimumAge: number;
      maximumAge?: number;
    };
    pricing: {
      originalPrice: number;
      discount?: number;
      amount: number;
      currency: string;
      taxPercent: number;
    };
  };
}

const TestCard: React.FC<TestProps> = ({ test }) => {
  const defaultImage = "/images/default.jpg";
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full bg-white rounded-2xl p-4 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col md:flex-row h-full">
        <img
          src={test.imageUrl || defaultImage}
          alt={test.name}
          className="w-full md:w-1/3 h-60 object-cover rounded-2xl mr-4"
          style={{ width: "300px", height: "300px" }}
        />

        <div className=" flex flex-col flex-grow">
          <h2 className="text-3xl font-bold text-gray-900 text-left mb-3">
        {test.name} ({test.details.totalQuestions} Questions)
          </h2>

          <p className="text-gray-700 text-base leading-relaxed inline">
        {showFullDescription
          ? test.description
          : `${test.description.slice(0, 150)}...`}

        {test.description.length > 200 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-primary mt-2 ml-2 inline text-sm font-medium hover:underline"
          >
            {showFullDescription ? "View Less" : "View More"}
          </button>
        )}
          </p>

          <div className="mt-3 flex flex-col space-y-4 text-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">Benefits:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {test.benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-primary bg-opacity-10 text-primary text-sm px-3 py-1 rounded-full"
          >
            {benefit}
          </div>
            ))}
          </div>
        </div>
          </div>

          <div className="mt-3">
        <h3 className="text-lg font-semibold text-gray-800">Pricing:</h3>
        <p className="text-gray-800 text-base">
          <span className="font-bold text-xl text-primary">
            {test.pricing.currency} {test.pricing.amount.toFixed(2)}
          </span>
          {test.pricing.discount && (
            <span className="line-through text-gray-500 ml-3">
          {test.pricing.currency}{" "}
          {test.pricing.originalPrice.toFixed(2)}
            </span>
          )}
        </p>
          </div>

          <button
        onClick={() => router.push(`/tests/edit?slug=${test.slug}`)}
        className="mt-6 py-3 px-6 w-full bg-primary text-white text-lg rounded-lg hover:bg-secondary transition-all duration-300 shadow-lg"
          >
        Edit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
