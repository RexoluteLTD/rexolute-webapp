import { GenericObject, Role } from ".";

export type User = {
  id?: string;
  name: string;
  email: string;
  gender: string;
  profileImg: string;
  role: Role;
};

export type Therapist = User & {
  degree: string;
  experience: string;
  specialty: number;
  rating: number;
};

export type Client = User & {
  type: "default" | "student";
};

export type Profile = {
  user_id: string;
  dob: string;
  gender: string;
};

export type TherapistProfile = Profile & {
  country: string;
  doc: TherapistProfileDoc;
  payment: TherapistProfilePayment;
  schedule: TherapistProfileSchedule;
  profile_img?: string;
  is_approved: boolean;
  is_active: boolean;
  is_onboarded: boolean;
  is_setup: boolean;
  rating: number;
  expertise: GenericObject[];
  specialities: GenericObject[];
  CreatedAt: string;
  UpdatedAt: string;
  name: string;
  email: string;
  phone_number: string;
};

type TherapistProfileDoc = {
  about: string;
  bio: string;
  degree_issuer: string;
  degree_type: string;
  degrees: GenericObject[];
  id_type: string;
  id_cards: string[];
  license_number: string;
  license_issuer: string;
  licenses: GenericObject[];
  years_exp: string;
};

type TherapistProfilePayment = {
  acc_name: string;
  acc_number: string;
  interval: string;
  bank_name: string;
};

type TherapistProfileSession = {
  daily_limit: string;
  weekly_limit: string;
  sessions_type: {
    audio: boolean;
    in_person: boolean;
    text: boolean;
    video: boolean;
  };
};

type TherapistProfileAvailability = {
  mondays: GenericObject[];
  tuesdays: GenericObject[];
  wednesdays: GenericObject[];
  thurdays: GenericObject[];
  fridays: GenericObject[];
  saturdays: GenericObject[];
  sundays: GenericObject[];
};

type TherapistProfileSchedule = {
  availability: TherapistProfileAvailability;
  sessions: TherapistProfileSession;
};
