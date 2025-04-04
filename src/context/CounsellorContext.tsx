"use client";

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLoading } from "@/context/LoadingContext";
import {
  AvailabilityType,
  BranchType,
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
import {
  createCounsellor,
  getCounsellor,
  UpdateBranches,
  updateCommunicationModes,
  updateLanguages,
  updatePersonalInfo,
  updatePricing,
  updateProfessionalInfo,
  UpdateProfileImg,
  updateSchedule,
  updateSpecialties,
  updateVerification,
} from "@/utils/counsellor";

interface CounsellorContextType {
  // State
  counsellorId: string;
  usermode: string;
  counsellorDetails: CounsellorDetails;
  education: Education[];
  licenses: License[];
  communication_modes: CommunicationModes;
  pricing: PricingItem[];
  schedule: ScheduleItem[];
  languages: Language[];
  specialties: string[];
  profileImage: File | null;
  primaryAddress: BranchType;
  preferredCenterAddress: {
    id: string;
    full_address: string;
    city: string;
  };

  // Actions
  updateCounsellorDetails: (field: keyof CounsellorDetails, value: any) => void;
  addEducation: (education: Education) => void;
  updateEducation: (index: number, education: Partial<Education>) => void;
  deleteEducation: (index: number) => void;
  addLicense: (license: License) => void;
  updateLicense: (index: number, license: Partial<License>) => void;
  deleteLicense: (index: number) => void;
  addLanguage: (newLanguage: Language) => void;
  deleteLanguage: (index: number) => void;
  updateLanguage: (index: number, updates: Partial<Language>) => void;
  addSpecialty: (specialty: string) => void;
  deleteSpecialty: (index: number) => void;
  updateSpecialty: (index: number, updatedSpecialty: string) => void;
  updateCommunicationMode: (
    mode: keyof CommunicationModes,
    value: boolean
  ) => void;
  updatePricingItem: (index: number, updates: Partial<PricingItem>) => void;
  updateScheduleItem: (day: DayOfWeek, updates: Partial<ScheduleItem>) => void;
  setProfileImage: (file: File | null) => void;
  updatePrimaryAddress: (field: keyof BranchType, value: string) => void;
  setPreferredCenterAddress: Dispatch<
    SetStateAction<{
      id: string;
      full_address: string;
      city: string;
    }>
  >;
  createUser: () => Promise<void>;
  UpdateBranchDetails: () => Promise<void>;
}

const CounsellorContext = createContext<CounsellorContextType | undefined>(
  undefined
);

export function CounsellorProvider({
  children,
  mode,
  id,
}: {
  children: React.ReactNode;
  mode?: string | null;
  id?: string | null;
}) {
  const router = useRouter();
  const { setLoading } = useLoading();

  // State variables
  const [counsellorId, setCounsellorId] = useState(id || "");
  const [usermode, setUsermode] = useState(mode || "create");

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

  const [education, setEducation] = useState<Education[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [communication_modes, setCommunication_modes] =
    useState<CommunicationModes>({
      chat: false,
      call: false,
      video: false,
      in_person: false,
    });
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { day: "Monday", startTime: "09:00", endTime: "17:00", isWorkingDay: true },
    {
      day: "Tuesday",
      startTime: "09:00",
      endTime: "17:00",
      isWorkingDay: true,
    },
    {
      day: "Wednesday",
      startTime: "09:00",
      endTime: "17:00",
      isWorkingDay: true,
    },
    {
      day: "Thursday",
      startTime: "09:00",
      endTime: "17:00",
      isWorkingDay: true,
    },
    { day: "Friday", startTime: "09:00", endTime: "17:00", isWorkingDay: true },
    { day: "Saturday", startTime: null, endTime: null, isWorkingDay: false },
    { day: "Sunday", startTime: null, endTime: null, isWorkingDay: false },
  ]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [primaryAddress, setPrimaryAddress] = useState<BranchType>({
    street_address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [preferredCenterAddress, setPreferredCenterAddress] = useState<{
    id: string;
    full_address: string;
    city: string;
  }>({
    id: "",
    full_address: "",
    city: "",
  });
  function extractAddress(data: {
    id: string;
    full_address: string;
    city: string;
  }) {
    const parts = data.full_address.split(",").map((part) => part.trim());
    const length = parts.length;

    if (length < 3) {
      throw new Error("Invalid address format");
    }

    return {
      street_address: parts.slice(0, length - 3).join(", "),
      city: parts[length - 3],
      state: parts[length - 2],
      pincode: parts[length - 1],
    };
  }
  // Fetch counsellor data if in edit mode
 useEffect(() => {
   const fetchCounsellor = async (id: string) => {
     setLoading(true);
     try {
       const res = await getCounsellor(id);

       // Set basic counsellor details
       setCounsellorDetails({
         name: res.personalInfo.name,
         email: res.personalInfo.email,
         phone: res.personalInfo.phone,
         timezone:
           res.sessionInfo.availability.timeZone ||
           Intl.DateTimeFormat().resolvedOptions().timeZone,
         dateOfBirth: res.personalInfo.dateOfBirth,
         profileImage: res.personalInfo.profileImage,
         gender: res.personalInfo.gender,
         biography: res.personalInfo.biography,
         title: res.professionalInfo.title,
         yearsOfExperience: res.professionalInfo.yearsOfExperience,
         isVerified: res.verificationStatus.isVerified,
         documentsVerified: res.verificationStatus.documentsVerified,
         backgroundCheckDate: res.verificationStatus.backgroundCheckDate,
       });

       // Set education
       if (
         res.professionalInfo.education &&
         Array.isArray(res.professionalInfo.education)
       ) {
         setEducation(
           res.professionalInfo.education.map((edu: Education) => ({
             degree: edu.degree,
             field: edu.field,
             institution: edu.institution,
             year: edu.year,
           }))
         );
       }

       // Set licenses
       if (
         res.professionalInfo.licenses &&
         Array.isArray(res.professionalInfo.licenses)
       ) {
         setLicenses(
           res.professionalInfo.licenses.map((license: License) => ({
             type: license.type,
             licenseNumber: license.licenseNumber,
             issuingAuthority: license.issuingAuthority,
             validUntil: license.validUntil,
           }))
         );
       }

       // Set specialties
       if (
         res.practiceInfo.specialties &&
         Array.isArray(res.practiceInfo.specialties)
       ) {
         setSpecialties(res.practiceInfo.specialties);
       }

       // Set languages
       if (
         res.practiceInfo.languages &&
         Array.isArray(res.practiceInfo.languages)
       ) {
         setLanguages(
           res.practiceInfo.languages.map((lang: Language) => ({
             language: lang.language,
             proficiencyLevel: lang.proficiencyLevel,
           }))
         );
       }

       if (res.addresses && res.addresses.length > 0) {
         // Set primary address from first address
         setPrimaryAddress({
           street_address: res.addresses[0].address || "",
           city: res.addresses[0].city || "",
           state: res.addresses[0].state || "",
           pincode: res.addresses[0].pincode || "",
         });

         // Set preferred center address from second address if it exists
         if (res.addresses.length > 1) {
           setPreferredCenterAddress({
             id: Math.random().toString(36).substr(2, 9),
             full_address: `${res.addresses[1].address}, ${res.addresses[1].city}, ${res.addresses[1].state} - ${res.addresses[1].pincode}`,
             city: res.addresses[1].city,
           });
         }
       }
       // Set communication modes
       const availableModes =
         res.sessionInfo.availability.communicationModes || [];
       setCommunication_modes({
         chat: availableModes.includes("chat"),
         call: availableModes.includes("call"),
         video: availableModes.includes("video"),
         in_person: availableModes.includes("in_person"),
       });

       // Set pricing
       if (res.sessionInfo.pricing && res.sessionInfo.pricing.rates) {
         setPricing(
           res.sessionInfo.pricing.rates.map((rate: PricingItem) => {
             let typeOfAvailability: AvailabilityType = "chat";

             // Map session type to availability type
             if (rate.sessionType.includes("Chat")) {
               typeOfAvailability = "chat";
             } else if (rate.sessionType.includes("Video")) {
               typeOfAvailability = "video";
             } else if (rate.sessionType.includes("In-Person")) {
               typeOfAvailability = "in_person";
             } else {
               typeOfAvailability = "call";
             }

             return {
               sessionType: rate.sessionType as SessionType,
               sessionTitle: rate.sessionTitle,
               price: rate.price,
               currency: rate.currency || "INR",
               typeOfAvailability,
             };
           })
         );
       }

       // Set schedule
       if (
         res.sessionInfo.availability &&
         res.sessionInfo.availability.weeklySchedule
       ) {
         // Create a day mapping
         const dayMapping: Record<string, DayOfWeek> = {
           Sunday: "Sunday",
           Monday: "Monday",
           Tuesday: "Tuesday",
           Wednesday: "Wednesday",
           Thursday: "Thursday",
           Friday: "Friday",
           Saturday: "Saturday",
         };

         // Convert API schedule to component schedule format
         const updatedSchedule = [...schedule]; // Start with the default schedule

         interface DayScheduleAPI {
           day: string;
           isWorkingDay: number;
           working_hours: {
             start: string | null;
             end: string | null;
           };
         }
         res.sessionInfo.availability.weeklySchedule.forEach(
           (daySchedule: DayScheduleAPI) => {
             const dayOfWeek: DayOfWeek = dayMapping[daySchedule.day];
             if (dayOfWeek) {
               const scheduleIndex: number = updatedSchedule.findIndex(
                 (item: ScheduleItem) => item.day === dayOfWeek
               );
               if (scheduleIndex !== -1) {
                 updatedSchedule[scheduleIndex] = {
                   day: dayOfWeek,
                   isWorkingDay: daySchedule.isWorkingDay === 1,
                   startTime: daySchedule.working_hours.start
                     ? daySchedule.working_hours.start.substring(0, 5)
                     : null,
                   endTime: daySchedule.working_hours.end
                     ? daySchedule.working_hours.end.substring(0, 5)
                     : null,
                 };
               }
             }
           }
         );

         setSchedule(updatedSchedule);
       }
     } catch (error) {
       console.error("Error fetching counsellor data:", error);
       toast.error("Error fetching counsellor data");
     }
     setLoading(false);
   };
   if (mode === "edit" && id) {
     fetchCounsellor(id);
   }
 }, [mode, id]);

  // Update functions
  const updateCounsellorDetails = (
    field: keyof CounsellorDetails,
    value: any
  ) => {
    setCounsellorDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addEducation = (education: Education) => {
    setEducation((prev) => [...prev, education]);
  };

  const updateEducation = (index: number, updates: Partial<Education>) => {
    setEducation((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, ...updates } : edu))
    );
  };

  const deleteEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const addLicense = (license: License) => {
    setLicenses((prev) => [...prev, license]);
  };

  const updateLicense = (index: number, updates: Partial<License>) => {
    setLicenses((prev) =>
      prev.map((lic, i) => (i === index ? { ...lic, ...updates } : lic))
    );
  };

  const deleteLicense = (index: number) => {
    setLicenses((prev) => prev.filter((_, i) => i !== index));
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

  const updateCommunicationMode = (
    mode: keyof CommunicationModes,
    value: boolean
  ) => {
    setCommunication_modes((prev) => ({ ...prev, [mode]: value }));
  };

  const updatePricingItem = (index: number, updates: Partial<PricingItem>) => {
    setPricing((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const updateScheduleItem = (
    day: DayOfWeek,
    updates: Partial<ScheduleItem>
  ) => {
    setSchedule((prev) =>
      prev.map((item) => (item.day === day ? { ...item, ...updates } : item))
    );
  };

  const updatePrimaryAddress = (field: keyof BranchType, value: string) => {
    setPrimaryAddress((prev) => ({ ...prev, [field]: value }));
  };

  const createUser = async () => {
    setLoading(true);
    try {
      const id = await createCounsellor(
        counsellorDetails.name,
        counsellorDetails.email,
        counsellorDetails.phone,
        counsellorDetails.timezone
      );
      if (!id) {
        toast.error("Error creating counsellor");
        return;
      }
      if (profileImage) {
        await UpdateProfileImg(id, profileImage);
      }
      await updatePersonalInfo(id, counsellorDetails);
      await updateProfessionalInfo(id, {
        title: counsellorDetails.title,
        yearsOfExperience: counsellorDetails.yearsOfExperience,
        education,
        licenses,
      });
      await UpdateBranches(
        id,
        primaryAddress,
        extractAddress(preferredCenterAddress)
      );
      await updatePricing(id, pricing);
      await updateCommunicationModes(
        id,
        Object.keys(communication_modes)
          .filter((key) => communication_modes[key as keyof CommunicationModes])
          .join(",")
      );
      await updateSchedule(id, schedule);
      await updateLanguages(id, languages);
      await updateSpecialties(id, specialties);
      toast.success("Counsellor created successfully");
      router.push("/counsellors");
    } catch (error) {
      console.error("Error creating counsellor:", error);
      toast.error("Error creating counsellor");
    }
    setLoading(false);
  };

  const UpdateBranchDetails = async () => {
    if (!id) {
      toast.error("Counsellor ID is required");
      return;
    }
    console.log(extractAddress(preferredCenterAddress));

    const res = await UpdateBranches(
      id,
      primaryAddress,
      extractAddress(preferredCenterAddress)
    );
    if (!res) {
      toast.error("Error updating branch details");
    }
  };

  const value = {
    counsellorId,
    usermode,
    counsellorDetails,
    education,
    licenses,
    communication_modes,
    pricing,
    schedule,
    languages,
    specialties,
    profileImage,
    primaryAddress,
    preferredCenterAddress,
    updateCounsellorDetails,
    addEducation,
    updateEducation,
    deleteEducation,
    addLicense,
    updateLicense,
    deleteLicense,
    updateCommunicationMode,
    updatePricingItem,
    updateScheduleItem,
    setProfileImage,
    updatePrimaryAddress,
    setPreferredCenterAddress,
    createUser,
    UpdateBranchDetails,
    addLanguage,
    deleteLanguage,
    updateLanguage,
    addSpecialty,
    deleteSpecialty,
    updateSpecialty,
  };

  return (
    <CounsellorContext.Provider value={value}>
      {children}
    </CounsellorContext.Provider>
  );
}

export function useCounsellor() {
  const context = useContext(CounsellorContext);
  if (!context) {
    throw new Error("useCounsellor must be used within a CounsellorProvider");
  }
  return context;
}
