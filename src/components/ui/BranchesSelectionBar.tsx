"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLoading } from "@/context/LoadingContext";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { getBranches } from "@/utils/branches";

export function BranchesSelectionBar(props: {
  value: {
    id: string;
    full_address: string;
    city: string;
  };
  isDisabled:boolean;
  setValue: React.Dispatch<
    React.SetStateAction<{
      id: string;
      full_address: string;
      city: string;
    }>
  >;
}) {
  const [open, setOpen] = React.useState(false);
  const { value, setValue, isDisabled } = props;

  const [branchSearchTerm, setBranchsearchTerm] = React.useState<string>("");
  const [branchPreviewList, setBranchPreviewList] = React.useState<
    Array<{ city: string; id: string; full_address: string }>
  >([]);
  const [branchFilterList, setBranchFilterList] = React.useState<
    Array<{ city: string; id: string; full_address: string }>
  >([]);
  const [selectedBranch, setSelectedBranch] = React.useState<{
    id: string;
    full_address: string;
    city: string;
  } | null>(null);

  const { setLoading } = useLoading();

  // Load branches on component mount
  React.useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response: Array<any> = await getBranches();
        console.log("API Response:", response); // Debugging log

        if (Array.isArray(response) && response.length > 0) {
          const results = response.map((branch) => ({
            city: branch.city || "Unknown City",
            id: branch.id || "Unknown ID",
            full_address: branch.full_address || "No Address Provided",
          }));
          setBranchPreviewList(results);
          setBranchFilterList(results);
        } else {
          console.error("Invalid API response format or empty results:", response);
          setBranchPreviewList([]);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        setBranchPreviewList([]);
      }
      setLoading(false);
    };
    fetchBranches();
  }, []);

  // Update value when selectedBranch changes
  React.useEffect(() => {
    if (selectedBranch) {
      setValue({
        id: selectedBranch.id,
        full_address: selectedBranch.full_address,
        city: selectedBranch.city,
      });
    }
  }, [selectedBranch, setValue]);

  // Filter branches based on search term
  React.useEffect(() => {
    setBranchFilterList(
      branchPreviewList.filter((item) =>
        item.city.toLowerCase().includes(branchSearchTerm.toLowerCase())
      )
    );
  }, [branchSearchTerm, branchPreviewList]);

  // Handle branch selection
  const handleBranchSelect = (branch: {
    id: string;
    full_address: string;
    city: string;
  }) => {
    setSelectedBranch(branch);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={isDisabled}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between py-6"
        >
          {value?.city || "Select branches..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-h-[300px]">
        <Command>
          <div className="px-3 py-2 flex gap-2 items-center border border-gray-300 rounded-md">
            <FaMagnifyingGlass />
            <input
              type="text"
              placeholder="Search branches..."
              value={branchSearchTerm}
              onChange={(e) => setBranchsearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <CommandList className="max-h-[250px] overflow-y-auto">
            {branchFilterList.length === 0 ? (
              <CommandEmpty>No branches found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Branches">
                {branchFilterList.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleBranchSelect(item)}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.id === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium text-sm">{item.city}</h4>
                      <p className="text-xs text-gray-500">
                        {item.full_address}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
