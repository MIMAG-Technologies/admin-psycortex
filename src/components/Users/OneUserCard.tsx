import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEdit, AiOutlineExperiment } from "react-icons/ai";
import {
  FaRegCalendarAlt,
  FaMars,
  FaVenus,
  FaGenderless,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { fetchTests, suggestTest as suggestTestAPI } from "@/utils/tests";

interface Test {
  name: string;
  slug: string;
  pricing: {
    amount: number;
    currency: string;
  };
}

export default function OneUserCard(props: {
  profile_image: string;
  id: string;
  name: string;
  date_of_birth: string;
  gender: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState({
    slug: "",
    amount: 0,
    name: "",
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (showModal) {
      loadTests();
    }
  }, [showModal]);

  const loadTests = async () => {
    setLoading(true);
    try {
      const testsData = await fetchTests();
      setTests(testsData);
    } catch (error) {
      console.error("Error loading tests:", error);
      toast.error("Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  const suggestTest = async () => {
    if (!selectedTest) {
      toast.error("Please select a test to suggest");
      return;
    }

    setLoading(true);
    try {
      const success = await suggestTestAPI(props.id, selectedTest.slug,selectedTest.amount);
      
      if (success) {
        toast.success("Test successfully suggested");
        setShowModal(false);
        setSelectedTest({
          slug: "",
          amount: 0,
          name: "",
        });
      } else {
        toast.error("Failed to suggest test");
      }
    } catch (error) {
      console.error("Error suggesting test:", error);
      toast.error("Failed to suggest test");
    } finally {
      setLoading(false);
    }
  };

  const ageCalculator = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Gender Icons Logic
const getGenderIcon = (gender: string | null | undefined) => {
  if (!gender) return <FaGenderless className="text-gray-500" />; // Handle missing values

  switch (gender.toLowerCase()) {
    case "male":
      return <FaMars className="text-blue-500" />;
    case "female":
      return <FaVenus className="text-pink-500" />;
    default:
      return <FaGenderless className="text-gray-500" />;
  }
};

const router = useRouter();


  return (
    <>
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-slate-100 p-4 border border-slate-300 w-full sm:flex-nowrap">
        {/* Profile Image */}
        <img
          className="h-16 w-16 rounded-full object-cover border border-gray-400 sm:h-20 sm:w-20"
          src={props.profile_image}
          alt="User Profile"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/images/user-dummy-img.png";
          }}
        />

        {/* User Details */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {props.name}
          </h3>

          <div className="flex flex-col sm:flex-row sm:gap-4">
            {/* Age */}
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaRegCalendarAlt className="text-blue-500" />
              {ageCalculator(props.date_of_birth)} Years Old
            </p>

            {/* Gender */}
            <p className="text-sm text-gray-600 flex items-center gap-2 capitalize">
              {getGenderIcon(props.gender)}
              {props.gender}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-2 sm:w-auto sm:ml-auto flex-wrap sm:flex-nowrap">
          <button
            className="flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-primary transition hover:bg-primary hover:text-white sm:w-auto"
            onClick={() => {
              router.push(`/users/view?id=${props.id}`);
            }}
          >
            <AiOutlineEye className="h-5 w-5" />
            View
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary sm:w-auto"
            onClick={() => {
              router.push(`/users/create?id=${props.id}&mode=edit`);
            }}
          >
            <AiOutlineEdit className="h-5 w-5" />
            Edit
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 sm:w-auto"
            onClick={() => setShowModal(true)}
          >
            <AiOutlineExperiment className="h-5 w-5" />
            Assign Test
          </button>
        </div>
      </div>

      {/* Modal for Test Selection */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Assign a Test</h3>
            <p className="text-sm text-gray-600 mb-4">Select a test to assign to {props.name}</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800">
                Note: The selected test will be available for {props.name} to take once without any payment required.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center my-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                value={selectedTest.slug}
                onChange={(e) => {
                  const test = tests.find(t => t.slug === e.target.value);
                  if (test) {
                    setSelectedTest({
                      slug: test.slug,
                      amount: test.pricing.amount,
                      name: test.name,
                    });
                  }
                }}
              >
                <option value="">Select a test</option>
                {tests.map((test) => (
                  <option key={test.slug} value={test.slug}>
                    {test.name} - {test.pricing.currency} {test.pricing.amount}
                  </option>
                ))}
              </select>
            )}
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
                onClick={() => {
                  setShowModal(false);
                  setSelectedTest({
                    slug: "",
                    amount: 0,
                    name: "",
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                onClick={suggestTest}
                disabled={loading || !selectedTest}
              >
                Assign Test
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
