"use client";
import BasicDetails from "@/components/Counsellors/BasicDetails";
import {
  AvailabilityType,
  CommunicationModes,
  CounsellorDetails,
  DayOfWeek,
  Education,
  Language,
  License,
  PricingItem,
  ScheduleItem,
  SessionType,
} from "@/types/counsellors";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Page() {
  const [counsellorId, setCounsellorId] = useState("");
  const [step, setStep] = useState<number>(1)

  const [counsellorDetails, setCounsellorDetails] = useState<CounsellorDetails>(
    {
      name: "",
      email: "",
      phone: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateOfBirth: "",
      profileImage: "",
      gender: "",
      biography: "",
      title: "",
      yearsOfExperience: 0,
      isVerified: true,
      documentsVerified: true,
      backgroundCheckDate: new Date().toISOString().split("T")[0],
    }
  );

  const [education, setEducation] = useState<Array<Education>>([]);

  const [communication_modes, setCommunication_modes] =
    useState<CommunicationModes>({
      chat: false,
      call: false,
      video: false,
      in_person: false,
    });

  const [pricing, setPricing] = useState<Array<PricingItem>>([]);

  const [schedule, setSchedule] = useState<Array<ScheduleItem>>([
    {
      day: "Monday",
      startTime: null,
      endTime: null,
      isWorkingDay: true,
    },
    {
      day: "Tuesday",
      startTime: null,
      endTime: null,
      isWorkingDay: true,
    },
    {
      day: "Wednesday",
      startTime: null,
      endTime: null,
      isWorkingDay: true,
    },
    {
      day: "Thursday",
      startTime: null,
      endTime: null,
      isWorkingDay: false,
    },
    {
      day: "Friday",
      startTime: null,
      endTime: null,
      isWorkingDay: true,
    },
    {
      day: "Saturday",
      startTime: null,
      endTime: null,
      isWorkingDay: true,
    },
    {
      day: "Sunday",
      startTime: null,
      endTime: null,
      isWorkingDay: false,
    },
  ]);

  const [languages, setLanguages] = useState<Array<Language>>([]);

  const [specialties, setSpecialties] = useState<Array<string>>([]);

  const [lisences, setLicenses] = useState<Array<License>>([]);

  // 1. Function to update counsellorDetails
  const updateCounsellorDetails = (
    attribute: keyof CounsellorDetails,
    value: any
  ) => {
    setCounsellorDetails((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  };

  // 2. Education functions
  const addEducation = (newEducation: Education) => {
    setEducation((prev) => [...prev, newEducation]);
  };

  const deleteEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (
    index: number,
    updatedEducation: Partial<Education>
  ) => {
    setEducation((prev) =>
      prev.map((edu, i) =>
        i === index ? { ...edu, ...updatedEducation } : edu
      )
    );
  };

  const addLicense = (newLicense: License) => {
    setLicenses((prev) => [...prev, newLicense]);
  };

  // Delete a license at the specified index
  const deleteLicense = (index: number) => {
    setLicenses((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a license at the specified index with partial or complete new data
  const updateLicense = (index: number, updatedLicense: Partial<License>) => {
    setLicenses((prev) =>
      prev.map((license, i) =>
        i === index ? { ...license, ...updatedLicense } : license
      )
    );
  };

  // 3. Communication modes function
  const updateCommunicationMode = (
    mode: keyof CommunicationModes,
    value: boolean
  ) => {
    setCommunication_modes((prev) => {
      const updated = {
        ...prev,
        [mode]: value,
      };

      // 4. Automatically update pricing when communication modes change
      updatePricingBasedOnCommunicationModes(updated);

      return updated;
    });
  };

  // 4. Function to update pricing based on communication modes
  const updatePricingBasedOnCommunicationModes = (
    modes: CommunicationModes
  ) => {
    const newPricing: Array<PricingItem> = [];

    // Map communication modes to session types and availability types
    const modeMapping: Record<
      keyof CommunicationModes,
      { sessionType: SessionType; availabilityType: AvailabilityType }
    > = {
      chat: {
        sessionType: "1 Hr Chat",
        availabilityType: "chat",
      },
      call: {
        sessionType: "1 Hr Session",
        availabilityType: "call",
      },
      video: {
        sessionType: "1 Hr Video Session",
        availabilityType: "video",
      },
      in_person: {
        sessionType: "1 Hr In-Person Session",
        availabilityType: "in_person",
      },
    };

    // Get current pricing items to preserve existing values
    const currentPricing = pricing.reduce((acc, item) => {
      acc[item.typeOfAvailability] = item;
      return acc;
    }, {} as Record<AvailabilityType, PricingItem>);

    // For each enabled mode, add a pricing item
    Object.entries(modes).forEach(([mode, enabled]) => {
      if (enabled) {
        const typedMode = mode as keyof CommunicationModes;
        const { sessionType, availabilityType } = modeMapping[typedMode];

        // Check if we already have pricing for this mode
        if (currentPricing[availabilityType]) {
          newPricing.push(currentPricing[availabilityType]);
        } else {
          // Create new pricing item with default values
          newPricing.push({
            sessionType,
            sessionTitle: `Standard ${mode} consultation`,
            price: 0, // Default price
            currency: "USD", // Default currency
            typeOfAvailability: availabilityType,
          });
        }
      }
    });

    setPricing(newPricing);
  };

  // Additional function to update a specific pricing item
  const updatePricingItem = (index: number, updates: Partial<PricingItem>) => {
    setPricing((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  // 5. Schedule update function
  const updateScheduleItem = (
    day: DayOfWeek,
    updates: Partial<ScheduleItem>
  ) => {
    setSchedule((prev) =>
      prev.map((item) => (item.day === day ? { ...item, ...updates } : item))
    );
  };

  // 6. Languages functions
  const addLanguage = (newLanguage: Language) => {
    setLanguages((prev) => [...prev, newLanguage]);
  };

  const deleteLanguage = (index: number) => {
    setLanguages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, updates: Partial<Language>) => {
    setLanguages((prev) =>
      prev.map((lang, i) => (i === index ? { ...lang, ...updates } : lang))
    );
  };

  // 7. Specialties functions
  const addSpecialty = (specialty: string) => {
    setSpecialties((prev) => [...prev, specialty]);
  };

  const deleteSpecialty = (index: number) => {
    setSpecialties((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpecialty = (index: number, updatedSpecialty: string) => {
    setSpecialties((prev) =>
      prev.map((specialty, i) => (i === index ? updatedSpecialty : specialty))
    );
  };
   const router = useRouter();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      onClick={() => router.back()}
    >
      
      <div
        className="relative max-w-3xl w-full bg-white shadow-lg rounded-lg p-6 my-[5vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
        >
          <IoClose size={24} />
        </button>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Basic Counsellor Details
        </h1>

        <BasicDetails
          counsellorDetails={counsellorDetails}
          updateCounsellorDetails={updateCounsellorDetails}
        />

        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded-md font-medium transition ${
              step === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-900"
            }`}
          >
            Previous
          </button>

          <p className="text-gray-600 font-medium">Step {step} of 4</p>

          <button
            disabled={step === 4}
            onClick={() => setStep((prev) => Math.min(prev + 1, 4))}
            className={`px-4 py-2 rounded-md font-medium transition ${
              step === 4
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
