"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineEdit, AiOutlineReload, AiOutlineQuestionCircle } from "react-icons/ai";
interface Test {
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
}

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
  index: number;
  tests: Test[];
  setTests: React.Dispatch<React.SetStateAction<Test[]>>;
  updatePriorities: (updatedTests: Test[]) => Promise<void>;
}

const TestCard: React.FC<TestProps> = ({
  test,
  index,
  tests,
  setTests,
  updatePriorities,
}) => {
  const defaultImage = "/images/default.jpg";
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [priority, setPriority] = useState(tests.length - index);
  const completed: string[] = ["academic", "adss", "aggression", "bai", "bdi", "happiness", "ies", "marital-adjustment", "schizophrenia", "spiritual", "sas", "pre-marital", "scat", "wbs", "suicidal-ideation-scale", "scs"];
  const isCompleted = completed.includes(test.slug);

  const handlePriorityUpdate = async () => {
    const updatedTests = [...tests];
    // Remove the test from its current position
    const testToMove = updatedTests.splice(index, 1)[0];
    // Calculate new position based on priority (higher priority = lower index)
    const newPosition = Math.max(0, Math.min(tests.length - 1, tests.length - priority));
    // Insert the test at its new position
    updatedTests.splice(newPosition, 0, testToMove);
    setTests(updatedTests);
    await updatePriorities(updatedTests);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full bg-white rounded-2xl p-4 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col md:flex-row h-full">
        <img
          src={test.imageUrl || defaultImage}
          alt={test.name}
          className="w-full md:w-1/3 h-60 object-cover rounded-2xl mr-4"
          style={{ width: "300px", height: "300px" }}
        />

        <div className="flex flex-col flex-grow">
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

          <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
            <button
              onClick={() => router.push(`/tests/edit?slug=${test.slug}`)}
              className="flex items-center justify-center py-3 px-6 bg-primary bg-opacity-20 text-primary text-lg rounded-lg border border-primary hover:bg-opacity-30 transition-all duration-300 shadow-lg w-full md:w-1/4"
            >
              <span className="mr-2">
                <AiOutlineEdit />
              </span>
              Edit Test
            </button>

            <button
              onClick={() => router.push(`/tests/edit/${test.slug === "marital-adjustment" ? "marital" : test.slug === "suicidal-ideation-scale" ? "suicidal" : test.slug}`)}
              disabled={!isCompleted}
              className={`flex items-center justify-center py-3 px-6 ${isCompleted
                ? "bg-blue-100 text-blue-700 border-blue-500 cursor-pointer"
                : "bg-gray-100 text-gray-700 border-gray-500 cursor-not-allowed"
                } text-lg rounded-lg border  hover:bg-blue-200 transition-all duration-300 shadow-lg w-full md:w-1/4`}
            >
              <span className="mr-2">
                <AiOutlineQuestionCircle />
              </span>
              Edit Questions
            </button>

            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-2/4">
              <div className="flex items-center w-full md:w-1/2">
                <label
                  htmlFor="priority"
                  className="mr-2 font-medium text-gray-700"
                >
                  Priority:
                </label>
                <input
                  id="priority"
                  type="text"
                  value={priority}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= tests.length) {
                      setPriority(val);
                    }
                  }}
                  className="w-24 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={handlePriorityUpdate}
                className="flex items-center justify-center py-3 px-6 bg-green-100 text-green-700 text-lg rounded-lg border border-green-500 hover:bg-green-200 transition-all duration-300 shadow-lg w-full md:w-1/2"
              >
                <span className="mr-2">
                  <AiOutlineReload />
                </span>
                Update Priority
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
