"use client";

import { useEffect, useState, Suspense } from "react";
import { IoSearch, IoAddCircle } from "react-icons/io5";
import AddBranchModal from "@/components/Branches/AddBranchModal";
import BranchCard from "@/components/Branches/BranchCard";
import { addBranches, deleteBranches, getBranches } from "@/utils/branches";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

type branch = {
  id: string;
  city: string;
  branch_name: string;
  full_address: string;
  street_address: string;
  state: string;
  pincode: string;
  is_active: boolean;
};

// Component with useSearchParams for modal
function SearchParamsHandler({ setModalOpen }: { setModalOpen: (open: boolean) => void }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (mode === "create") {
      setModalOpen(true);
    }
  }, [mode, setModalOpen]);

  return null;
}

// Main content component that uses client hooks
const BranchesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";

  const [branches, setBranches] = useState<Array<branch>>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cityList, setcityList] = useState<Array<string>>([]);
  const { setLoading } = useLoading();

  // Update URL with search parameter
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    // Update the URL without refreshing the page
    router.push(`/branches?${params.toString()}`, { scroll: false });
  }, [searchQuery, router]);

  // Filter branches based on search query
  const filteredBranches = branches.filter((branch) =>
    branch.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchBranches = async () => {
    setLoading(true);
    const res = await getBranches();

    setBranches(res);
    setcityList(Array.from(new Set(res.map((branch: branch) => branch.city))));
    setLoading(false);
  };

  const handleDeleteBranch = async (id: string) => {
    setLoading(true);
    const res: boolean = await deleteBranches(id);

    if (res) {
      toast.success("Branch deleted successfully");
      fetchBranches();
    } else {
      toast.error("Failed to delete branch");
    }
    setLoading(false);
  };

  const handleAddBranch = async (branch: {
    city: string;
    street_address: string;
    state: string;
    pincode: string;
    branch_name: string;
  }) => {
    setLoading(true);
    const res: boolean = await addBranches(
      branch.city,
      branch.street_address,
      branch.state,
      branch.pincode,
      branch.branch_name
    );
    if (res) {
      toast.success("Branch added successfully");
      fetchBranches();
    } else {
      toast.error("Failed to add branch");
    }
    setLoading(false);
  };

  // Function to handle search with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Branches Management
      </h1>

      {/* Suspense Boundary for SearchParams */}
      <Suspense fallback={null}>
        <SearchParamsHandler setModalOpen={setModalOpen} />
      </Suspense>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Branches by City"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-800"
          />
          <IoSearch
            className="absolute top-3 right-3 text-gray-500"
            size={20}
          />
        </div>

        {/* Add Branch Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
        >
          <IoAddCircle size={18} />
          Create Branch
        </button>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <BranchCard
            key={branch.id}
            id={branch.id}
            branch_name={branch.branch_name}
            city={branch.city}
            full_address={branch.full_address}
            onDelete={handleDeleteBranch}
          />
        ))}
      </div>

      {/* Add Branch Modal */}
      {isModalOpen && (
        <AddBranchModal
          onClose={() => setModalOpen(false)}
          onAdd={handleAddBranch}
          cityList={cityList}
        />
      )}
    </div>
  );
};

// Loading fallback component
const BranchesLoading = () => (
  <div className="p-6 text-center">
    <p>Loading branches...</p>
  </div>
);

// Main component with Suspense boundary
export default function BranchesManagement() {
  return (
    <Suspense fallback={<BranchesLoading />}>
      <BranchesContent />
    </Suspense>
  );
}
