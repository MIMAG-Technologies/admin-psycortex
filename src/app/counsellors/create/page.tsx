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
  createCredentials,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function Page() {
  const [counsellorId, setCounsellorId] = useState("");
  const [usermode, setmode] = useState<string>("");
  const [maxStep, setmaxStep] = useState<number>(6);

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
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfileImage(event.target.files[0]);
    }
  };

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
    setLanguages((prev) => {
      // Check if the language already exists (excluding the current index)
      const isDuplicate = prev.some(
        (lang, i) =>
          i !== index &&
          lang.language.trim().toLowerCase() ===
            updates.language?.trim().toLowerCase()
      );

      if (isDuplicate && updates.language?.trim()) {
        setTimeout(() => {
          toast.error("This language has already been selected");
        }, 0);
        return prev;
      }

      return prev.map((lang, i) =>
        i === index ? { ...lang, ...updates } : lang
      );
    });
  };

  // 7. Specialties functions
  const addSpecialty = (specialty: string) => {
    setSpecialties((prev) => [...prev, specialty]);
  };

  const deleteSpecialty = (index: number) => {
    setSpecialties((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpecialty = (index: number, updatedSpecialty: string) => {
    setSpecialties((prev) => {
      const updatedSpecialties = prev.map((specialty, i) =>
        i === index ? updatedSpecialty : specialty
      );

      const isDuplicate = updatedSpecialties.some(
        (specialty, i) =>
          i !== index &&
          specialty.toLowerCase() === updatedSpecialty.toLowerCase()
      );

      if (isDuplicate) {
        setTimeout(() => {
          toast.error("This specialty has already been selected");
        }, 0);

        return prev;
      }

      return updatedSpecialties;
    });
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

  // Progress Bar Width Calculation
  const progressWidth = ((step - 1) / (maxStep - 1)) * 100;
  const router = useRouter();
  const { setLoading } = useLoading();
  const transitionClass = "transition-opacity duration-300 ease-in-out";

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const [primaryAddress, setprimaryAddress] = useState<BranchType>({
    street_address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [preferredCenterAddress, setpreferredCenterAddress] = useState<{
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

  const updatePrimaryAddress = (field: keyof BranchType, value: string) => {
    setprimaryAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
          setprimaryAddress({
            street_address: res.addresses[0].address || "",
            city: res.addresses[0].city || "",
            state: res.addresses[0].state || "",
            pincode: res.addresses[0].pincode || "",
          });

          // Set preferred center address from second address if it exists
          if (res.addresses.length > 1) {
            setpreferredCenterAddress({
              id: Math.random().toString(36).substr(2, 9),
              full_address: `${res.addresses[1].address}, ${res.addresses[1].city}, ${res.addresses[1].state} , ${res.addresses[1].pincode}`,
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
      setCounsellorId(id);
      setmode("edit");
      setmaxStep(5);
      fetchCounsellor(id);
    }
  }, [mode, id]);

  const buildCommunicationModesString = (modes: CommunicationModes): string => {
    return Object.entries(modes)
      .filter(([_, enabled]) => enabled)
      .map(([mode]) => mode)
      .join(",");
  };
  const UpdateBranchDetails = async (c_id?: string) => {
    const counsellorId = c_id || id;
    if (!counsellorId) {
      toast.error("Counsellor ID is required");
      return;
    }

    const res = await UpdateBranches(
      counsellorId,
      primaryAddress,
      extractAddress(preferredCenterAddress)
    );
    if (!res) {
      toast.error("Error updating branch details");
    }
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
        setLoading(false);
        return;
      }
      const ccres = await createCredentials(id);
      if (!ccres) {
        toast.error("Error creating credentials");
        setLoading(false);
        return;
      }
      if (profileImage) {
        await UpdateProfileImg(id, profileImage);
      }
      await updatePersonalInfo(id, {
        name: counsellorDetails.name,
        dateOfBirth: counsellorDetails.dateOfBirth,
        gender: counsellorDetails.gender,
        biography: counsellorDetails.biography,
        email: counsellorDetails.email,
        phone: counsellorDetails.phone,
        profileImage: counsellorDetails.profileImage,
      });

      await updateProfessionalInfo(id, {
        title: counsellorDetails.title,
        yearsOfExperience: counsellorDetails.yearsOfExperience,
        education: education,
        licenses: lisences,
      });
      await UpdateBranchDetails(id);
      await updatePricing(id, pricing);
      await updateCommunicationModes(
        id,
        buildCommunicationModesString(communication_modes)
      );
      await updateSchedule(id, schedule);
      await updateLanguages(id, languages);
      await updateSpecialties(id, specialties);
      await updateVerification(id, {
        isVerified: counsellorDetails.isVerified,
        documentsVerified: counsellorDetails.documentsVerified,
        backgroundCheckDate: counsellorDetails.backgroundCheckDate,
      });
      toast.success("Counsellor created successfully");
      router.push(`/counsellors`);
    } catch (error) {
      toast.error("Error creating counsellor");
      console.error("Error creating counsellor:", error);
      setLoading(false);
    }
    setLoading(false);
  };

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
            profileImage={profileImage}
            handleFileChange={handleFileChange}
            primaryAddress={primaryAddress}
            UpdateBranchDetails={UpdateBranchDetails}
            updatePrimaryAddress={updatePrimaryAddress}
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
            mode={usermode ? usermode : ""}
            id={counsellorId ? counsellorId : ""}
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
            preferredCenterAddress={preferredCenterAddress}
            setpreferredCenterAddress={setpreferredCenterAddress}
            UpdateBranchDetails={UpdateBranchDetails}
            mode={usermode ? usermode : ""}
            id={counsellorId ? counsellorId : ""}
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
            mode={usermode ? usermode : ""}
            id={counsellorId ? counsellorId : ""}
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
            mode={usermode ? usermode : ""}
            id={counsellorId ? counsellorId : ""}
          />
        </div>

        <div
          className={`${transitionClass} ${
            step === 6 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <Verification createUser={createUser} />
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

          <p className="text-gray-600 font-medium">
            Step {step} of {maxStep}
          </p>

          <button
            disabled={step === maxStep}
            onClick={() => {
              let isValid = true;
              let errorMessage = "";

              if (step === 1) {
                if (
                  !counsellorDetails.name.trim() ||
                  !counsellorDetails.email.trim() ||
                  !counsellorDetails.phone.trim() ||
                  !counsellorDetails.dateOfBirth.trim() ||
                  !counsellorDetails.gender.trim() ||
                  !counsellorDetails.biography.trim() ||
                  !primaryAddress.city.trim() ||
                  !primaryAddress.pincode.trim() ||
                  !primaryAddress.state.trim() ||
                  !primaryAddress.street_address.trim()
                ) {
                  isValid = false;
                  errorMessage =
                    "Please complete all personal information fields.";
                }
              }

              if (step === 2) {
                if (
                  !counsellorDetails.title.trim() ||
                  counsellorDetails.yearsOfExperience <= 0 ||
                  education.length === 0 ||
                  education.some(
                    (edu) =>
                      !edu.degree.trim() ||
                      !edu.field.trim() ||
                      !edu.institution.trim() ||
                      !edu.year
                  ) ||
                  lisences.some(
                    (license) =>
                      !license.type.trim() ||
                      !license.licenseNumber.trim() ||
                      !license.issuingAuthority.trim() ||
                      !license.validUntil
                  )
                ) {
                  isValid = false;
                  errorMessage =
                    "Please provide a title, experience, and at least one education entry with all fields filled. If licenses are provided, ensure no fields are empty.";
                }
              }

              if (step === 3) {
                const selectedModes =
                  Object.values(communication_modes).filter(Boolean).length;
                if (
                  selectedModes < 2 ||
                  pricing.some(
                    (item) => item.price <= 0 || !item.sessionTitle.trim()
                  ) ||
                  (communication_modes.in_person &&
                    (!preferredCenterAddress.full_address.trim() ||
                      !preferredCenterAddress.city.trim()))
                ) {
                  isValid = false;
                  errorMessage =
                    "Select at least two communication modes, ensure their pricing details are complete, and provide a preferred center location if 'in_person' is selected.";
                }
              }

              if (step === 4) {
                if (
                  languages.length < 2 ||
                  specialties.length < 2 ||
                  languages.some(
                    (lang) =>
                      !lang.language.trim() || !lang.proficiencyLevel.trim()
                  ) ||
                  specialties.some((specialty) => !specialty.trim())
                ) {
                  isValid = false;
                  errorMessage =
                    "Please select at least two languages and two specialties, and ensure no fields are empty.";
                }
              }

              if (step === 5) {
                const workingDays = schedule.filter((day) => day.isWorkingDay);
                if (
                  workingDays.length < 3 ||
                  workingDays.some(
                    (day) =>
                      !day.startTime ||
                      !day.endTime ||
                      day.startTime >= day.endTime
                  )
                ) {
                  isValid = false;
                  errorMessage =
                    "At least 3 working days must be selected with valid start and end times.";
                }
              }

              if (!isValid) {
                toast.error(errorMessage);
                return;
              }

              // Proceed to the next step if validation passes
              setStep((prev) => Math.min(prev + 1, maxStep));
            }}
            className={`px-4 py-2 rounded-md font-medium transition ${
              step === maxStep
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
