"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai"; 
import Loading from "@/components/Loading";
import { useLoading } from "@/context/LoadingContext";
import axios from "axios";
import { toast } from "react-toastify"; // Using react-toastify as shown in your updated code
import { updatetest } from "@/utils/tests";

interface TestData {
  name: string;
  slug: string;
  imageUrl?: string;
  description: string;
  benefits: string[];
  shortDescription: string;
  details: {
    durationMinutes: number;
    totalQuestions: number;
  };
  pricing: {
    originalPrice: number;
    discount?: number;
    amount: number;
    currency: string;
    taxPercent: number;
  };
}

export default function EditTestForm() {
  return (
    <Suspense fallback={<Loading />}>
      <EditTestPage />
    </Suspense>
  );
}

function EditTestPage() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [isNewTest, setIsNewTest] = useState(false);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    taxPercent: "",
    description: "",
    benefits: "",
    shortDescription: "",
    durationMinutes: "",
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${base_url}/tests/get_all_tests.php`);
        const data = await response.data;

        if (data.success && Array.isArray(data.tests)) {
          const selectedTest = data.tests.find(
            (test: TestData) => test.slug === slug
          );

          if (selectedTest) {
            setFormData({
              name: selectedTest.name || "",
              description: selectedTest.description || "",
              price: selectedTest.pricing?.amount?.toString() || "",
              taxPercent: selectedTest.pricing?.taxPercent?.toString() || "",
              benefits: selectedTest.benefits?.join(", ") || "",
              shortDescription:selectedTest.shortDescription || null,
              durationMinutes: selectedTest.details?.durationMinutes?.toString() || "",
            });
          } else {
            setIsNewTest(true);
          }
        } else {
          setError("Failed to fetch tests: Invalid response format");
        }
      } catch (fetchError) {
        console.error("Error fetching test details:", fetchError);
        setError("An error occurred while fetching test details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTestDetails();
    } else {
      setIsNewTest(true);
      setLoading(false);
    }
  }, [slug, setLoading]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await updatetest({
      slug: slug || '',
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      taxPercent: parseFloat(formData.taxPercent),
      benefits: formData.benefits,
      shortDescription:formData.shortDescription || "",
      durationMinutes: parseInt(formData.durationMinutes),
    });

    if (res) {
      toast.success("Test updated successfully");
      router.back();
    } else {
      toast.error("Error updating the test!");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 p-4 ">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-white px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-center text-slate-800">
            {isNewTest ? "Create New Test" : "Edit Test"}
          </h2>

          <button
            className="absolute top-4 right-4 text-secondary hover:text-secondary-dark transition-colors"
            onClick={() => router.back()}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-50 text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-slate-700">
                  Test Name
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter test name"
                  required
                />
              </div>

              {/* <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-slate-700">
                  Thumbnail Image
                </label>
                <div className="w-full p-3 rounded-md border border-dashed border-primary bg-primary bg-opacity-5">
                  <div className="w-full">
                    <input
                      type="file"
                      id="thumbnail-upload"
                      accept="image/*"
                      className="w-full cursor-pointer"
                      onChange={handleThumbnailChange}
                    />
                    <p className="text-xs mt-1.5 text-slate-500">
                      {isNewTest
                        ? "Upload an image file for the test thumbnail (recommended size: 800x450px)"
                        : "Upload a new image to replace the current thumbnail"}
                    </p>
                  </div>
                </div>
              </div> */}

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">
                  Tax Percentage
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                  value={formData.taxPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, taxPercent: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-slate-700">
                  Description
                </label>
                <textarea
                  className="w-full p-2.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                  style={{ minHeight: "120px" }}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter test description"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-slate-700">
                  Reasons
                </label>
                <textarea
                  className="w-full p-2.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                  style={{ minHeight: "120px" }}
                  value={formData.shortDescription || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value || "" })
                  }
                  placeholder="Enter test description"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-slate-700">
                  Benefits (comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                  value={formData.benefits}
                  onChange={(e) =>
                    setFormData({ ...formData, benefits: e.target.value })
                  }
                  placeholder="Enter benefits separated by commas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">
                  Duration (in minutes)
                </label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-md border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, durationMinutes: e.target.value })
                  }
                  placeholder="Enter duration in minutes"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                className="px-5 py-2.5 rounded-md font-medium text-white bg-secondary hover:bg-secondary-dark transition-colors"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-md font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
              >
                {isNewTest ? "Create Test" : "Update Test"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}