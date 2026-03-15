export interface Cafe {
  id: string;
  name: string;
  description: string;
  employees: number;
  logo: string | null;
  location: string;
}

export interface Employee {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  days_worked: number;
  cafe: string;
}

export interface CafeFormValues {
  name: string;
  description: string;
  location: string;
  logo?: File | null;
}

export interface EmployeeFormValues {
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  cafe_id?: string;
  start_date?: string;
}
