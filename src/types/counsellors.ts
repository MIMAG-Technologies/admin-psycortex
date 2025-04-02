export type CounsellorDetails = {
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
};

export type Education = {
  degree: string;
  field: string;
  institution: string;
  year: number;
};
export type License = {
  type: string;
  licenseNumber: string;
  issuingAuthority: string;
  validUntil: string;
};

export type CommunicationModes = {
  chat: boolean;
  call: boolean;
  video: boolean;
  in_person: boolean;
};

export type SessionType =
  | "1 Hr Session"
  | "1 Hr Chat"
  | "1 Hr Video Session"
  | "1 Hr In-Person Session";
export type AvailabilityType = "chat" | "call" | "video" | "in_person";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type ScheduleItem = {
  day: DayOfWeek;
  startTime: string | null;
  endTime: string | null;
  isWorkingDay: boolean;
};

export type PricingItem = {
  sessionType: SessionType;
  sessionTitle: string;
  price: number;
  currency: string;
  typeOfAvailability: AvailabilityType;
};

export type Language = {
  language: string;
  proficiencyLevel:
    | "Basic"
    | "Conversational"
    | "Professional"
    | "Fluent"
    | "Native";
};

export type BranchType = {
  street_address: string;
  city: string;
  state: string;
  pincode: string;
};
