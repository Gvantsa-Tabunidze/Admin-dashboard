// interfaces/AuthProps.ts
export interface AuthProps {
  first_name: string;
  last_name: string;
  id: string;
  phone: string;
  email: string;
  password: string;
  profile_image?: File | string | undefined;
  role: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  vehicle?: string;
  working_days?: WeekDay;
  working_hours?: WorkingHours;
}

export interface WorkingHours {
  start: string; // Format: "HH:mm"
  end: string; // Format: "HH:mm"
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
