import Link from "next/link";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";

export default function Page() {
  const [counsellorId, setCounsellorId] = useState("");
  
  interface CounsellorDetails {
    name: string;
    email: string;
    phone: string;
    timezone: string;
    dateOfBirth: string;
    profileImage: string;
    gender: string;
    biography: string;
    title: string;
    yearsOfExperience: number;
    isVerified: boolean;
    documentsVerified: boolean;
    backgroundCheckDate: string;
  }

  const [counsellorDetails, setCounsellorDetails] = useState<CounsellorDetails>({
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
    backgroundCheckDate: new Date().toISOString().split('T')[0],
  });

  interface Education {
    degree: string;
    field: string;
    institution: string;
    year: number;
  }

  const [education, setEducation] = useState<Array<Education>>([]);

  interface CommunicationModes {
    chat: boolean;
    call: boolean;
    video: boolean;
    in_person: boolean;
  }

  const [communication_modes, setCommunication_modes] = useState<CommunicationModes>({
    chat: false,
    call: false,
    video: false,
    in_person: false,
  });

  type SessionType = "1 Hr Session" | "1 Hr Chat" | "1 Hr Video Session" | "1 Hr In-Person Session";
  type AvailabilityType = 'chat' | 'call' | 'video' | 'in_person';

  interface PricingItem {
    sessionType: SessionType;
    sessionTitle: string;
    price: number;
    currency: string;
    typeOfAvailability: AvailabilityType;
  }

  const [pricing, setPricing] = useState<Array<PricingItem>>([]);

  type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

  interface ScheduleItem {
    day: DayOfWeek;
    startTime: string | null;
    endTime: string | null;
    isWorkingDay: boolean;
  }

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

  interface Language {
    language: string;
    proficiencyLevel: "Basic" | "Conversational" | "Professional" | "Fluent" | "Native";
  }

  const [languages, setLanguages] = useState<Array<Language>>([]);
  
  const [specialties, setSpecialties] = useState<Array<string>>([]);

  // 1. Function to update counsellorDetails
  const updateCounsellorDetails = (attribute: keyof CounsellorDetails, value: any) => {
    setCounsellorDetails(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  // 2. Education functions
  const addEducation = (newEducation: Education) => {
    setEducation(prev => [...prev, newEducation]);
  };

  const deleteEducation = (index: number) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, updatedEducation: Partial<Education>) => {
    setEducation(prev => 
      prev.map((edu, i) => 
        i === index ? { ...edu, ...updatedEducation } : edu
      )
    );
  };

  // 3. Communication modes function
  const updateCommunicationMode = (mode: keyof CommunicationModes, value: boolean) => {
    setCommunication_modes(prev => {
      const updated = {
        ...prev,
        [mode]: value
      };
      
      // 4. Automatically update pricing when communication modes change
      updatePricingBasedOnCommunicationModes(updated);
      
      return updated;
    });
  };
  
  // 4. Function to update pricing based on communication modes
  const updatePricingBasedOnCommunicationModes = (modes: CommunicationModes) => {
    const newPricing: Array<PricingItem> = [];
    
    // Map communication modes to session types and availability types
    const modeMapping: Record<keyof CommunicationModes, { sessionType: SessionType, availabilityType: AvailabilityType }> = {
      chat: { 
        sessionType: "1 Hr Chat", 
        availabilityType: "chat" 
      },
      call: { 
        sessionType: "1 Hr Session", 
        availabilityType: "call" 
      },
      video: { 
        sessionType: "1 Hr Video Session", 
        availabilityType: "video" 
      },
      in_person: { 
        sessionType: "1 Hr In-Person Session", 
        availabilityType: "in_person" 
      }
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
            typeOfAvailability: availabilityType
          });
        }
      }
    });
    
    setPricing(newPricing);
  };
  
  // Additional function to update a specific pricing item
  const updatePricingItem = (index: number, updates: Partial<PricingItem>) => {
    setPricing(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    );
  };

  // 5. Schedule update function
  const updateScheduleItem = (day: DayOfWeek, updates: Partial<ScheduleItem>) => {
    setSchedule(prev => 
      prev.map(item => 
        item.day === day ? { ...item, ...updates } : item
      )
    );
  };

  // 6. Languages functions
  const addLanguage = (newLanguage: Language) => {
    setLanguages(prev => [...prev, newLanguage]);
  };

  const deleteLanguage = (index: number) => {
    setLanguages(prev => prev.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, updates: Partial<Language>) => {
    setLanguages(prev => 
      prev.map((lang, i) => 
        i === index ? { ...lang, ...updates } : lang
      )
    );
  };

  // 7. Specialties functions
  const addSpecialty = (specialty: string) => {
    setSpecialties(prev => [...prev, specialty]);
  };

  const deleteSpecialty = (index: number) => {
    setSpecialties(prev => prev.filter((_, i) => i !== index));
  };

  const updateSpecialty = (index: number, updatedSpecialty: string) => {
    setSpecialties(prev => 
      prev.map((specialty, i) => 
        i === index ? updatedSpecialty : specialty
      )
    );
  };



  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-4 border-slate-300 justify-center sm:justify-between">
        <h1 className="text-2xl w-full sm:w-fit font-bold text-gray-800 mr-auto text-center sm:text-left">
          Counsellors
        </h1>

        {/* Search Input */}

        {/* Create User Button */}
        <Link
          href="/counsellors/create"
          className="w-full sm:w-fit rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary flex justify-center sm:justify-start gap-1 items-center"
        >
          <BiPlus />
          Create Counsellor
        </Link>
      </div>
    </div>
  );
}
