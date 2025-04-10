export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | number;
  date_of_birth: string;
  gender: string;
  profile_image: string;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type AppointmentDetails = {
  id: number;
  session_details: {
    session_id: string;
    session_type: string;
    created_at: string;
  };
  user_details: {
    id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
    date_of_birth: string;
  };
  counsellor_details: {
    id: string;
    name: string;
  };
  case_history: {
    address: string;
    education: string;
    occupation: string;
    marital_status: string;
    family_type: string;
    family_members: string;
    identification_marks: string[];
    reliability: string;
    previous_consultation: boolean;
    previous_consultation_details: string;
    medical_history: {
      chief_complaints: string;
      present_illness_history: string;
      treatment_history: string;
      past_illness_history: string;
      family_history: string;
    };
    personal_history: {
      childhood_disorders: string;
      home_atmosphere: string;
      scholastic_activities: string;
      sexual_marital_history: string;
      premorbid_personality: string;
    };
    mental_status: {
      general_appearance: string;
      attitude: string;
      motor_behavior: string;
      speech: string;
      cognitive_functions: {
        attention_concentration: string;
        orientation: string;
        memory: string;
        abstract_ability: string;
        general_information: string;
        calculation: string;
        intelligence: string;
      };
      thought_process: {
        stream: string;
        form: string;
        possession: string;
        content: string;
      };
      mood_affect: string;
    };
    follow_up: {
      advice_activities: string;
      follow_up_session: string;
    };
  };
};


export type UserDetails = {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    profileImage: string;
  };
  preferences: {
    timezone: string;
  };
  accountInfo: {
    createdAt: string;
  };
  stats: {
    counselling: {
      total: number;
      completed: number;
      upcoming: number;
    };
    chat: {
      total: number;
      completed: number;
      upcoming: number;
    };
    call: {
      total: number;
      completed: number;
      upcoming: number;
      cancelled: number;
      missed: number;
    };
    tests: {
      total: number;
      completed: number;
      active: number;
      pending: number;
      paid: number;
      referred: number;
      referredUnpaid: number;
    };
    offline: {
      total: number;
      completed: number;
      upcoming: number;
    };
  };
};
