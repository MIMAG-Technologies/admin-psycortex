"use client";

import { FaClock, FaFileAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import TestProps from "@/types/tests";



const TestCard: React.FC<TestProps> = ({ test }) => {
  const defaultImage = "/images/default.jpg";
  const router = useRouter();

  return (
    <div className="w-full sm:w-80 lg:w-72 flex flex-col">
      <div className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300 border border-gray-200 flex flex-col h-full">
        
        
        <img
          src={test.imageUrl || defaultImage}
          alt={test.name}
          className="w-full h-48 object-cover"
        />

       
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg sm:text-xl font-semibold text-primary text-center">
            {test.name}
          </h2>

          
          <div className="flex justify-center space-x-4 text-sm text-secondary mt-3">
            <div className="flex items-center">
              <FaClock size={16} />
              <span className="ml-1">{test.details.durationMinutes} min</span>
            </div>
            <div className="flex items-center">
              <FaFileAlt size={16} />
              <span className="ml-1">{test.details.totalQuestions} Qs</span>
            </div>
          </div>

          
          <p className="mt-3 text-gray-600 text-sm text-center leading-relaxed flex-grow">
            {test.description}
          </p>

          
          <button
            onClick={() => router.push(`/tests/edit?slug=${test.slug}`)}
            className="mt-auto py-2 px-6 w-full bg-primary text-white text-sm sm:text-lg rounded-full hover:bg-secondary transition-all duration-300"
          >
            Edit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
