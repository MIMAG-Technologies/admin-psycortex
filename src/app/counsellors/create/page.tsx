"use client";
import BasicDetails from "@/components/Counsellors/BasicDetails";
import ModeAndPricing from "@/components/Counsellors/ModeAndPricing";
import ProfessionalInfo from "@/components/Counsellors/ProfessionalInfo";
import Schedule from "@/components/Counsellors/Schedule";
import SpecialitiesAndLanguages from "@/components/Counsellors/SpecialitiesAndLanguages";
import Verification from "@/components/Counsellors/Verification";
import { useLoading } from "@/context/LoadingContext";
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
import { getCounsellor } from "@/utils/counsellor";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function Page() {
  const [counsellorId, setCounsellorId] = useState("");
  const [usermode, setmode] = useState<string>("")

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
  const [lisences, setLicenses] = useState<Array<License>>([]);

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
      startTime: "09:00",
      endTime: "17:00",
      isWorkingDay: true,
    },
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
    {
      day: "Friday",
      startTime: "09:00",
      endTime: "17:00",
      isWorkingDay: true,
    },
    {
      day: "Saturday",
      startTime: null,
      endTime: null,
      isWorkingDay: false,
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
            sessionTitle: "",
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
  const [step, setStep] = useState<number>(1);

  // Step Titles
  const stepTitles = [
    "Basic Counsellor Information",
    "Professional Credentials & Experience",
    "Communication Preferences & Pricing",
    "Languages & Areas of Expertise",
    "Weekly Availability & Schedule",
    "Final Verification & Submission",
  ];
  // Total Steps
  const totalSteps = stepTitles.length;

  // Progress Bar Width Calculation
  const progressWidth = ((step - 1) / (totalSteps - 1)) * 100;
  const router = useRouter();
   const { setLoading } = useLoading();
  const transitionClass = "transition-opacity duration-300 ease-in-out";

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

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
                sessionTitle: "",
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
      setCounsellorId(id);
      setmode("edit");
      fetchCounsellor(id);
    }
  }, [mode, id]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 pt-5/4 z-50"
      onClick={() => router.back()}
    >
      <div
        className="relative max-w-3xl w-full bg-white shadow-lg rounded-lg p-6 my-[5vh] max-h-[90vh] overflow-y-scroll overflow-x-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
        >
          <IoClose size={24} />
        </button>

        <div className="absolute w-[99%] h-[4px] bg-gray-200 rounded-full overflow-hidden top-0 left-[0.5%]">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>

        {/* Step Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {stepTitles[step - 1]}
        </h1>

        {/* Step Sections with Transitions */}
        <div
          className={`${transitionClass} ${
            step === 1 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <BasicDetails
            counsellorDetails={counsellorDetails}
            updateCounsellorDetails={updateCounsellorDetails}
            mode={usermode ? usermode : ""}
            id={counsellorId ? counsellorId : ""}
          />
        </div>

        <div
          className={`${transitionClass} ${
            step === 2 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <ProfessionalInfo
            counsellorDetails={counsellorDetails}
            education={education}
            lisences={lisences}
            updateCounsellorDetails={updateCounsellorDetails}
            addEducation={addEducation}
            deleteEducation={deleteEducation}
            updateEducation={updateEducation}
            addLicense={addLicense}
            deleteLicense={deleteLicense}
            updateLicense={updateLicense}
          />
        </div>

        <div
          className={`${transitionClass} ${
            step === 3 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <ModeAndPricing
            communication_modes={communication_modes}
            pricing={pricing}
            updateCommunicationMode={updateCommunicationMode}
            updatePricingItem={updatePricingItem}
          />
        </div>

        <div
          className={`${transitionClass} ${
            step === 4 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <SpecialitiesAndLanguages
            languages={languages}
            specialties={specialties}
            addLanguage={addLanguage}
            deleteLanguage={deleteLanguage}
            updateLanguage={updateLanguage}
            addSpecialty={addSpecialty}
            deleteSpecialty={deleteSpecialty}
            updateSpecialty={updateSpecialty}
          />
        </div>

        <div
          className={`${transitionClass} ${
            step === 5 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <Schedule
            schedule={schedule}
            updateScheduleItem={updateScheduleItem}
          />
        </div>

        <div
          className={`${transitionClass} ${
            step === 6 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <Verification counsellorEmail={counsellorDetails.email} />
        </div>

        {/* Navigation Buttons */}
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

          <p className="text-gray-600 font-medium">Step {step} of 6</p>

          <button
            disabled={step === 6}
            onClick={() => setStep((prev) => Math.min(prev + 1, 6))}
            className={`px-4 py-2 rounded-md font-medium transition ${
              step === 6
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
