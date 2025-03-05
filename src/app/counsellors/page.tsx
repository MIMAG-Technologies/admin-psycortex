"use client";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";
import { useEffect, useState } from "react";
import CounsellorCard from "@/components/Counsellors/CounsellorCard";
import DeactivateModal from "@/components/Counsellors/DeactivateModal";
import { LuSettings2 } from "react-icons/lu";
import { getCounsellors } from "@/utils/counsellor";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

export default function Page() {
  interface Language {
    language: string;
    proficiencyLevel: string;
  }

  interface SessionRate {
    sessionType: string;
    price: number;
    currency: string;
    typeOfAvailability: string;
    sessionTitle: string;
  }

  interface Counselor {
    id: string;
    personalInfo: {
      name: string;
      profileImage: string;
    };
    professionalInfo: {
      title: string;
      yearsOfExperience: number;
    };
    practiceInfo: {
      specialties: string[];
      languages: Language[];
    };
    sessionInfo: {
      availability: {
        communicationModes: string[];
      };
      pricing: {
        currency: string;
        rates: SessionRate[];
      };
    };
    rating: {
      average: number;
    };
  }

  const [counsellors, setCounsellors] = useState<Array<Counselor>>([]);
  const [selectedCounsellor, setSelectedCounsellor] =
    useState<Counselor | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const router = useRouter();
  const { setLoading } = useLoading();

  // Fetch Counsellors
  useEffect(() => {
    const fetchAllCounsellors = async () => {
      setLoading(true);
      const response = await getCounsellors();
      setCounsellors(response);
      setLoading(false);
    };
    fetchAllCounsellors();
  }, []);

  // Handlers
  const handleViewProfile = (id: string) => {
    router.push(`/counsellors/view?id=${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/counsellors/create?mode=edit&id=${id}`);
  };

  const handleDeactivate = (id: string) => {
    const counsellor = counsellors.find((c) => c.id === id);
    if (counsellor) {
      setSelectedCounsellor(counsellor);
      setIsDeactivateModalOpen(true);
    }
  };

  const handleConfirmDeactivation = (
    startDate: string,
    endDate: string,
    message: string
  ) => {
    console.log("Deactivating Counsellor:", {
      id: selectedCounsellor?.id,
      name: selectedCounsellor?.personalInfo.name,
      startDate,
      endDate,
      message,
    });

    // Here you can call an API to deactivate the counsellor

    // Close Modal
    setIsDeactivateModalOpen(false);
    setSelectedCounsellor(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-4 border-slate-300 justify-center sm:justify-between">
        <h1 className="text-2xl w-full sm:w-fit font-bold text-gray-800 mr-auto text-center sm:text-left">
          Counsellors
        </h1>
        <Link
          href="#"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <LuSettings2 />
          Filters
        </Link>
        <Link
          href="/counsellors/create"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <BiPlus />
          Create Counsellor
        </Link>
      </div>

      <div className="space-y-4">
        {counsellors.map((counsellor) => (
          <CounsellorCard
            key={counsellor.id}
            counsellor={counsellor}
            onViewProfile={handleViewProfile}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
          />
        ))}
      </div>

      {/* Deactivation Modal */}
      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onSubmit={handleConfirmDeactivation}
        counsellorName={selectedCounsellor?.personalInfo.name || ""}
      />
    </div>
  );
}
