export interface Patient {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'other';
  birth_date: string;
  contact_info: string;
  created_by: number;
}
