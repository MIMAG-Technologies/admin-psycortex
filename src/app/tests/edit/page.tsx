"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TestData {
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  details: {
    durationMinutes: number;
    totalQuestions: number;
  };
  pricing: {
    amount: number;
    currency: string;
    taxPercent: number;
  };
}

export default function EditTestPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
const slug = searchParams.get("slug");


  const [testData, setTestData] = useState<TestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewTest, setIsNewTest] = useState(false); // Detect if it's a new test

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationMinutes: 0,
    totalQuestions: 0,
    taxPercent: 0,
  });

  useEffect(() => {
    const fetchTestDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://backend.psycortex.in/tests/get_all_tests.php");
        const data = await response.json();

        if (data.success && Array.isArray(data.tests)) {
          const selectedTest = data.tests.find((test: TestData) => test.slug === slug);

          if (selectedTest) {
            setTestData(selectedTest);
            setFormData({
              name: selectedTest.name || "",
              description: selectedTest.description || "",
              durationMinutes: selectedTest.details.durationMinutes || 0,
              totalQuestions: selectedTest.details.totalQuestions || 0,
              taxPercent: selectedTest.pricing?.taxPercent || 0,
            });
          } else {
            setIsNewTest(true); // If slug is not found, switch to general form
          }
        } else {
          setError("Failed to fetch tests: Invalid response format");
        }
      } catch (fetchError) {
        console.error("Error fetching test details:", fetchError);
        setError("An error occurred while fetching test details");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchTestDetails();
    } else {
      setIsNewTest(true);
      setIsLoading(false);
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://backend.psycortex.in/tests/update_or_create_test.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug || "new-test", ...formData }),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/tests");
      } else {
        setError(result.message || "Failed to update/create test");
      }
    } catch (submitError) {
      console.error("Error updating test:", submitError);
      setError("An error occurred while updating the test");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-primary text-center mb-4">
          {isNewTest ? "Create New Test" : `Edit Test: ${testData?.name}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-primary">Name</label>
            <input
              type="text"
              name="name"
              className="border w-full p-2 rounded focus:ring-2 focus:ring-secondary"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-primary">Description</label>
            <textarea
              name="description"
              className="border w-full p-2 rounded focus:ring-2 focus:ring-secondary"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-primary">Duration (minutes)</label>
              <input
                type="number"
                name="durationMinutes"
                className="border w-full p-2 rounded focus:ring-2 focus:ring-secondary"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-primary">Total Questions</label>
              <input
                type="number"
                name="totalQuestions"
                className="border w-full p-2 rounded focus:ring-2 focus:ring-secondary"
                value={formData.totalQuestions}
                onChange={(e) => setFormData({ ...formData, totalQuestions: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-primary">Tax Percent</label>
            <input
              type="number"
              name="taxPercent"
              className="border w-full p-2 rounded focus:ring-2 focus:ring-secondary"
              value={formData.taxPercent}
              onChange={(e) => setFormData({ ...formData, taxPercent: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-secondary text-white rounded-md shadow-md hover:opacity-90"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md shadow-md hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : isNewTest ? "Create Test" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
