"use client";
import Link from "next/link";
import { BiLink, BiPlus } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import CounsellorCard from "@/components/Counsellors/CounsellorCard";
import DeactivateModal from "@/components/Counsellors/DeactivateModal";
import { getCounsellors } from "@/utils/counsellor";
import { useRouter, useSearchParams } from "next/navigation";
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
    verificationStatus: string;
    documentsVerified: string;
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";

  const [counsellors, setCounsellors] = useState<Array<Counselor>>([]);
  const [filteredCounsellors, setFilteredCounsellors] = useState<
    Array<Counselor>
  >([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCounsellor, setSelectedCounsellor] =
    useState<Counselor | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const { setLoading } = useLoading();
  const isFetched = useRef(false);

  // Update URL with search parameter
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    // Update the URL without refreshing the page
    router.push(`/counsellors?${params.toString()}`, { scroll: false });
  }, [searchQuery, router]);

  const fetchAllCounsellors = async () => {
    setLoading(true);
    try {
      const response = await getCounsellors();
      setCounsellors(response);
      setFilteredCounsellors(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    fetchAllCounsellors();
  }, []);

  useEffect(() => {
    setFilteredCounsellors(
      counsellors.filter((counsellor) =>
        counsellor.personalInfo.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, counsellors]);

  const handleVerificationToggle = async () => {
    await fetchAllCounsellors();
  };

  // Function to handle search with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-4 border-slate-300 justify-center sm:justify-between">
        <h1 className="text-2xl w-full sm:w-fit font-bold text-gray-800 mr-auto text-center sm:text-left">
          Counsellors
        </h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-1/3 p-2 border rounded-md"
        />
        <Link
          href="/counsellors/send"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <BiLink />
          Send Links
        </Link>
        <Link
          href="/counsellors/create"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <BiPlus />
          Create Counsellor
        </Link>
      </div>

      {filteredCounsellors.length > 0 ? (
        <div className="space-y-4">
          {filteredCounsellors.map((counsellor) => (
            <CounsellorCard
              key={counsellor.id}
              counsellor={counsellor}
              onViewProfile={() =>
                router.push(`/counsellors/view?id=${counsellor.id}`)
              }
              onEdit={() =>
                router.push(`/counsellors/create?mode=edit&id=${counsellor.id}`)
              }
              onDeactivate={() => {
                setSelectedCounsellor(counsellor);
                setIsDeactivateModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-6">
          <p className="text-lg font-semibold">Oops! No counsellors found.</p>
          <p>You can create one using the button below.</p>
          <Link
            href="/counsellors/create"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary"
          >
            Create Counsellor
          </Link>
        </div>
      )}

      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onSubmit={() => setIsDeactivateModalOpen(false)}
        counsellorName={selectedCounsellor?.personalInfo.name || ""}
        counsellorId={selectedCounsellor?.id || ""}
        isVerified={selectedCounsellor?.verificationStatus === "1"}
        onVerificationToggle={handleVerificationToggle}
      />
    </div>
  );
}
