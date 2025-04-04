"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLoading } from "@/context/LoadingContext";
import { returnAppointmentUsers } from "@/utils/users";
import { FaMagnifyingGlass } from "react-icons/fa6";

export function UserSelectionBar(props: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  const { value, setValue } = props;

  const [usersearchTerm, setusersearchTerm] = React.useState<string>("");
  const [userPreviewList, setuserPreviewList] = React.useState<
    Array<{
      label: string;
      value: string;
      age: number;
      phone: string;
      gender: string;
      profile_image: string;
    }>
  >([]);

  const { setLoading } = useLoading();

  React.useEffect(() => {
    const handler = setTimeout(() => {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response: Array<{
            label: string;
            value: string;
            age: number;
            phone: string;
            gender: string;
            profile_image: string;
          }> = await returnAppointmentUsers(usersearchTerm);

          if (Array.isArray(response)) {
            const uniqueUsers = response.reduce((acc, user) => {
              if (!acc.some((u) => u.value === user.value)) acc.push(user);
              return acc;
            }, [] as Array<{ label: string; value: string; age: number; phone: string; gender: string; profile_image: string }>);

            setuserPreviewList(uniqueUsers);
          } else {
            console.error("Invalid API response format:", response);
            setuserPreviewList([]);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          setuserPreviewList([]);
        }
        setLoading(false);
      };
      fetchUser();
    }, 300);

    return () => clearTimeout(handler);
  }, [usersearchTerm]);

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
            ? userPreviewList.find((item) => item.value === value)?.label
            : `Select users...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <div className="px-3 py-2 flex gap-2 items-center border border-gray-300 rounded-md">
            <FaMagnifyingGlass />
            <input
              type="text"
              placeholder="Search users..."
              value={usersearchTerm}
              onChange={(e) => setusersearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <CommandList>
            {userPreviewList.length === 0 ? (
              <CommandEmpty>No users found.</CommandEmpty>
            ) : (
              <CommandGroup heading="User List">
                {userPreviewList.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue: string) => {
                        console.log("Selected Value:", currentValue); // Debugging
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Profile Image */}
                        <img
                          src={item.profile_image}
                          alt={`${item.label}'s profile`}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/user-dummy-img.png";
                          }}
                        />
                        <div>
                          {/* User Name and Age */}
                          <p className="font-medium capitalize">
                            {item.label.length > 16
                              ? `${item.label.slice(0, 13)}...`
                              : item.label}{" "}
                            ({item.age} years old)
                          </p>
                          {/* Phone Number and Gender */}
                          <p className="text-sm text-gray-500 capitalize">
                            {item.phone} | {item.gender}
                          </p>
                        </div>
                      </div>
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
