"use client";

import { useEffect, useState } from "react";
import { IoSearch, IoAddCircle } from "react-icons/io5";
import AddBranchModal from "@/components/Branches/AddBranchModal";
import BranchCard from "@/components/Branches/BranchCard";
import { addBranches, deleteBranches, getBranches } from "@/utils/branches";
import { toast } from "react-toastify";
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




export default function BranchesManagement() {
  const [branches, setBranches] = useState<Array<branch>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [cityList, setcityList] = useState<Array<string>>([])
   const { setLoading } = useLoading();

  // Filter branches based on search query
  const filteredBranches = branches.filter((branch) =>
    branch.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchBranches = async () => {
    setLoading(true);
    const res = await getBranches();
    
    setBranches(res);
    setcityList(Array.from(new Set(res.map((branch: branch) => branch.city))))
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
    branch_name:string;
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

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Branches Management
      </h1>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Branches by City"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
}
