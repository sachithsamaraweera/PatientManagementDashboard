export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  conditionCategory: string;
  condition: string;
  admissionDate: string;
  status: 'Active' | 'Discharged';
  remarks: string;
  locationType: 'Ward' | 'Clinic';
  wardName?: string;
  bedNumber?: string;
  clinicNumber?: string;
}