"use client";

import BasicDetails from "@/components/Counsellors/BasicDetails";
import ModeAndPricing from "@/components/Counsellors/ModeAndPricing";
import ProfessionalInfo from "@/components/Counsellors/ProfessionalInfo";
import Schedule from "@/components/Counsellors/Schedule";
import SpecialitiesAndLanguages from "@/components/Counsellors/SpecialitiesAndLanguages";
import Verification from "@/components/Counsellors/Verification";
import { CounsellorProvider, useCounsellor } from "@/context/CounsellorContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function Page() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  return (
    <CounsellorProvider mode={mode} id={id}>
      <CounsellorForm />
    </CounsellorProvider>
  );
}

function CounsellorForm() {
  const {
    counsellorDetails,
    education,
    licenses,
    communication_modes,
    pricing,
    schedule,
    languages,
    specialties,
    primaryAddress,
    preferredCenterAddress,
    usermode,
  } = useCounsellor();

  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [maxStep, setmaxStep] = useState<number>(6);
  useEffect(() => {
    if (usermode === "edit") {
      setmaxStep(5);
    }
  }, [usermode]);
  
  

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
  const transitionClass = "transition-opacity duration-300 ease-in-out";

  const validateStep = (): { isValid: boolean; errorMessage: string } => {
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
        errorMessage = "Please complete all personal information fields.";
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
        licenses.some(
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
        selectedModes < 1 ||
        pricing.some((item) => item.price <= 0 || !item.sessionTitle.trim()) ||
        (communication_modes.in_person &&
          (!preferredCenterAddress.full_address.trim() ||
            !preferredCenterAddress.city.trim()))
      ) {
        isValid = false;
        errorMessage =
          "Select at least one communication modes, ensure their pricing details are complete, and provide a preferred center location if 'in_person' is selected.";
      }
    }

    if (step === 4) {
      if (
        languages.length < 1 ||
        specialties.length < 1 ||
        languages.some(
          (lang) => !lang.language.trim() || !lang.proficiencyLevel.trim()
        ) ||
        specialties.some((specialty) => !specialty.trim())
      ) {
        isValid = false;
        errorMessage =
          "Please select at least one languages and one specialties, and ensure no fields are empty.";
      }
    }

    if (step === 5) {
      const workingDays = schedule.filter((day) => day.isWorkingDay);
      if (
        workingDays.length < 3 ||
        workingDays.some(
          (day) =>
            !day.startTime || !day.endTime || day.startTime >= day.endTime
        )
      ) {
        isValid = false;
        errorMessage =
          "At least 3 working days must be selected with valid start and end times.";
      }
    }

    return { isValid, errorMessage };
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
          <BasicDetails />
        </div>

        <div
          className={`${transitionClass} ${
            step === 2 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <ProfessionalInfo />
        </div>

        <div
          className={`${transitionClass} ${
            step === 3 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <ModeAndPricing />
        </div>

        <div
          className={`${transitionClass} ${
            step === 4 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <SpecialitiesAndLanguages />
        </div>

        <div
          className={`${transitionClass} ${
            step === 5 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <Schedule />
        </div>

        <div
          className={`${transitionClass} ${
            step === 6 ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <Verification />
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
              const { isValid, errorMessage } = validateStep();
              if (!isValid) {
                toast.error(errorMessage);
                return;
              }
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
