"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoClose, IoArrowBack, IoCloudUpload } from "react-icons/io5";

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
  const slug = searchParams.get("slug");

  const [testData, setTestData] = useState<TestData | null>(null);
  const { setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [isNewTest, setIsNewTest] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationMinutes: 0,
    totalQuestions: 0,
    taxPercent: 0,
    thumbnailFile: null as File | null,
  });

  useEffect(() => {
    const fetchTestDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://backend.psycortex.in/tests/get_all_tests.php"
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.tests)) {
          const selectedTest = data.tests.find(
            (test: TestData) => test.slug === slug
          );

          if (selectedTest) {
            setTestData(selectedTest);
            setFormData({
              name: selectedTest.name || "",
              description: selectedTest.description || "",
              durationMinutes: selectedTest.details.durationMinutes || 0,
              totalQuestions: selectedTest.details.totalQuestions || 0,
              taxPercent: selectedTest.pricing?.taxPercent || 0,
              thumbnailFile: null,
            });
            
            // Set thumbnail preview if exists
            if (selectedTest.imageUrl) {
              setThumbnailPreview(selectedTest.imageUrl);
            }
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
  }, [slug]);

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnailFile: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('slug', slug || 'new-test');
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('durationMinutes', formData.durationMinutes.toString());
      formDataToSubmit.append('totalQuestions', formData.totalQuestions.toString());
      formDataToSubmit.append('taxPercent', formData.taxPercent.toString());
      
      if (formData.thumbnailFile) {
        formDataToSubmit.append('thumbnailFile', formData.thumbnailFile);
      }

      const response = await fetch("https://backend.psycortex.in/tests/update_or_create_test.php", {
        method: "POST",
        body: formDataToSubmit,
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
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push("/tests");
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
        >
          <IoClose className="h-6 w-6" />
        </button>

        {/* Form Content */}
        <div className="p-8">
          <div className="flex items-center justify-center mb-6 relative">
            <button 
              onClick={handleBack} 
              className="absolute left-0 text-secondary hover:bg-gray-50 p-2 rounded-full transition-colors"
            >
              <IoArrowBack className="h-6 w-6" />
            </button>
            <h2 className="text-xl text-primary tracking-wide">
              {isNewTest ? "Create New Test" : `Edit Test: ${testData?.name}`}
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Thumbnail Upload */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  id="thumbnailUpload"
                  onChange={handleThumbnailChange}
                />
                <label 
                  htmlFor="thumbnailUpload" 
                  className="cursor-pointer"
                >
                  {thumbnailPreview ? (
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail Preview" 
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors">
                      <IoCloudUpload className="w-10 h-10 mb-2" />
                      <span className="text-xs text-center">Upload Thumbnail</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-secondary text-sm mb-2">Test Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-secondary text-sm mb-2">Description</label>
              <textarea
                name="description"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary text-sm mb-2">Test Length</label>
                <input
                  type="number"
                  name="durationMinutes"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  required
                  min="0"
                  placeholder="Minutes"
                />
              </div>
              <div>
                <label className="block text-secondary text-sm mb-2">Total Questions</label>
                <input
                  type="number"
                  name="totalQuestions"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
                  value={formData.totalQuestions}
                  onChange={(e) => setFormData({ ...formData, totalQuestions: Number(e.target.value) })}
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-secondary text-sm mb-2">Tax Percent</label>
              <input
                type="number"
                name="taxPercent"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
                value={formData.taxPercent}
                onChange={(e) => setFormData({ ...formData, taxPercent: Number(e.target.value) })}
                required
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : isNewTest ? "Create Test" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}