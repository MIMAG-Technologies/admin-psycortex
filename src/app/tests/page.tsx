
"use client";
import { useEffect, useState } from "react";
import {fetchTests}from "@/utils/tests";
import TestCard from "@/components/Tests/TestCard";
import { useLoading } from "@/context/LoadingContext";

interface Test {
  name: string;
  slug: string;
  imageUrl?: string;
  description: string;
  details: {
    durationMinutes: number;
    totalQuestions: number;
  };
}

const Tests = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const { setLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getTests = async () => {
      setLoading(true);
      try {
        const fetchedTests = await fetchTests();
        if (isMounted) {
          setTests(fetchedTests);
        }
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


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-primary w-full text-center sm:text-left">
          Tests For You
        </h1>
        <input
          className="bg-zinc-100 text-zinc-600 font-mono ring-1 ring-zinc-300 focus:ring-2 focus:ring-primary outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-[10px] px-4 py-2 shadow-md focus:shadow-lg w-full sm:w-[400px]"
          autoComplete="off"
          placeholder="Search Test Name"
          name="search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <TestCard key={test.slug} test={test} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No tests found</p>
      )}
    </div>
  );
};

export default Tests;
