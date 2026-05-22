export interface MedicalRecord {
  id: number;
  patient_id: number;
  diagnosis: string;
  confidence: number;
  created_at: string;
  created_by: number;
}
