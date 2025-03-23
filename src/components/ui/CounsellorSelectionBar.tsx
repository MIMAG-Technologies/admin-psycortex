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
import { returnAppointmentCounsellors } from "@/utils/counsellor";

export function CounsellorSelectionBar(props: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  const { value, setValue } = props;

  const [counsellotsearchTerm, setCounellorsearchTerm] = React.useState<string>("");
  const [coounsellorPreviewList, setCounsellorPreviewList] = React.useState<
    Array<{ label: string; value: string; profilepic: string }>
  >([]);
  const [coounsellorFilterList, setCounsellorFilterList] = React.useState<
    Array<{ label: string; value: string; profilepic: string }>
  >([]);


  const { setLoading } = useLoading();


  React.useEffect(() => {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response: Array<{
            label: string;
            value: string;
            profilepic: string;
          }> = await returnAppointmentCounsellors();

          if (Array.isArray(response)) {
            setCounsellorPreviewList(response);
            setCounsellorFilterList(response);
            
          } else {
            console.error("Invalid API response format:", response);
            setCounsellorPreviewList([]); 
          }
        } catch (error) {
          console.error("Error fetching counsellors:", error);
          setCounsellorPreviewList([]); 
        }
        setLoading(false);
      };
      fetchUser();
  }, []);

  React.useEffect(() => {
    setCounsellorFilterList(
      coounsellorPreviewList.filter((item) =>
        item.label.toLowerCase().includes(counsellotsearchTerm.toLowerCase())
      )
    );
  }, [counsellotsearchTerm])
  

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between py-6"
        >
          {value
            ? coounsellorPreviewList.find((item) => item.value === value)?.label
            : `Select counsellors...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <div className="px-3 py-2 flex gap-2 items-center border border-gray-300 rounded-md">
            <FaMagnifyingGlass />
            <input
              type="text"
              placeholder="Search counsellors..."
              value={counsellotsearchTerm}
              onChange={(e) => setCounellorsearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <CommandList>
            {coounsellorFilterList.length === 0 ? (
              <CommandEmpty>No counsellors found.</CommandEmpty>
            ) : (
              <CommandGroup heading="User List">
                {coounsellorFilterList.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue: string) => {
                        console.log("Selected Value:", currentValue);
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <img 
                        src={item.profilepic}
                        className="h-6 w-6 rounded-full object-cover" 
                        alt={`${item.label}'s profile`} 
                      />
                      {item.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
