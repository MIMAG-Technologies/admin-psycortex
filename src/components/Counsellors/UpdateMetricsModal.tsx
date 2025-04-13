"use client";

import React, { useEffect, useState } from "react";
import { getCounsellorMetrics, updateCounsellorMetrics } from "@/utils/counsellor";
import { toast } from "react-toastify";
import { useLoading } from "@/context/LoadingContext";

interface UpdateMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  counsellorId: string;
}

const UpdateMetricsModal: React.FC<UpdateMetricsModalProps> = ({
  isOpen,
  onClose,
  counsellorId,
}) => {
  interface Metrics {
    totalSessions: number;
    averageRating: number;
    totalReviews: number;
    responseRate: number;
    cancellationRate: number;
  }

  const [metrics, setMetrics] = useState<Metrics | null>(null);

 const { setLoading } = useLoading();

  // Fetch metrics when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchMetrics = async () => {
        setLoading(true);
        const res = await getCounsellorMetrics(counsellorId);
        if (res) {
          setMetrics(res);
        } else {
          toast.error("Failed to fetch metrics. Please try again.");
        }
        setLoading(false);
      };

      fetchMetrics();
    }
  }, [isOpen, counsellorId]);

  const handleInputChange = (field: keyof Metrics, value: number) => {
    if (metrics) {
      setMetrics((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!metrics) return;

    // Validation checks
    if (metrics.averageRating > 5) {
      toast.error("Average Rating cannot exceed 5.");
      return;
    }
    if (metrics.totalReviews > metrics.totalSessions) {
      toast.error("Total Reviews cannot exceed Total Sessions.");
      return;
    }
    if (metrics.responseRate > 100) {
      toast.error("Response Rate cannot exceed 100%.");
      return;
    }
    if (metrics.cancellationRate > 100) {
      toast.error("Cancellation Rate cannot exceed 100%.");
      return;
    }

    setLoading(true);
    const res = await updateCounsellorMetrics({
      counsellorId,
      ...metrics,
    });

    if (res) {
      toast.success("Metrics updated successfully!");
      onClose();
    } else {
      toast.error("Failed to update metrics. Please try again.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Update Counsellor Metrics
        </h2>

        {metrics ? (
          <div className="space-y-4">
            {/* Total Sessions */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Sessions
              </label>
              <input
                type="number"
                value={metrics.totalSessions}
                onChange={(e) =>
                  handleInputChange("totalSessions", Number(e.target.value))
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              />
            </div>

            {/* Average Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Average Rating (Max: 5)
              </label>
              <input
                type="number"
                step="0.1"
                value={metrics.averageRating}
                onChange={(e) =>
                  handleInputChange("averageRating", Number(e.target.value))
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              />
            </div>

            {/* Total Reviews */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Reviews (≤ Total Sessions)
              </label>
              <input
                type="number"
                value={metrics.totalReviews}
                onChange={(e) =>
                  handleInputChange("totalReviews", Number(e.target.value))
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              />
            </div>

            {/* Response Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Response Rate (%) (Max: 100)
              </label>
              <input
                type="number"
                value={metrics.responseRate}
                onChange={(e) =>
                  handleInputChange("responseRate", Number(e.target.value))
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              />
            </div>

            {/* Cancellation Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cancellation Rate (%) (Max: 100)
              </label>
              <input
                type="number"
                value={metrics.cancellationRate}
                onChange={(e) =>
                  handleInputChange("cancellationRate", Number(e.target.value))
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Failed to load metrics.</p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!metrics}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              !metrics
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMetricsModal;
