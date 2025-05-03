"use client";
import { useEffect, useState } from "react";
import { disableDiscount, fetchTests, UpdatePriorities } from "@/utils/tests";
import TestCard from "@/components/Tests/TestCard";
import { useLoading } from "@/context/LoadingContext";
import Link from "next/link";
import { toast } from "react-toastify";

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

const Tests = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const { setLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [test_priorities, setTest_priorities] = useState<
    Array<{ slug: string; priority: number }>
  >([]);

  useEffect(() => {
    let isMounted = true;

    const getTests = async () => {
      setLoading(true);
      try {
        const fetchedTests = await fetchTests();
        if (isMounted) {
          setTests(fetchedTests);
        }
        const priorities = fetchedTests.map((test: Test, index: number) => ({
          slug: test.slug,
          priority: fetchedTests.length - index,
        }));
        setTest_priorities(priorities);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getTests();

    return () => {
      isMounted = false;
    };
  }, []);
  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const updatePriorities = async (updatedTests: Test[]) => {
    const priorities = updatedTests.map((test, index) => ({
      slug: test.slug,
      priority: updatedTests.length - index,
    }));
    setLoading(true);
    const res = await UpdatePriorities(priorities);
    if (res) {
      toast.success("Test priorities updated successfully!");
    } else {
      toast.error("Error updating test priorities");
    }
    setLoading(false);
  };

  const deleteDiscounts = async () => {
    setLoading(true);
    const res = await disableDiscount();
    if (res) {
      toast.success("Discount offer deleted successfully!");

      const fetchedTests = await fetchTests();
      setTests(fetchedTests);
    } else {
      toast.error("Error deleting discount offer");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-primary text-center sm:text-left">
          Tests For You
        </h1>
        <input
          className="bg-zinc-100 text-zinc-600 font-mono ring-1 ring-zinc-300 focus:ring-2 focus:ring-primary outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-[10px] px-4 py-2 shadow-md focus:shadow-lg sm:w-[400px] ml-auto"
          autoComplete="off"
          placeholder="Search Test Name"
          name="search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Link
          className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 w-fit"
          href={"/tests/create-discount"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Discount
        </Link>
        <button
          className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 w-fit"
          onClick={deleteDiscounts}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Disable Discounts
        </button>
      </div>

      {filteredTests.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredTests.map((test, index) => (
            <TestCard
              key={test.slug}
              test={test}
              index={index}
              tests={tests}
              setTests={setTests}
              updatePriorities={updatePriorities}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No tests found</p>
      )}
    </div>
  );
};

export default Tests;
