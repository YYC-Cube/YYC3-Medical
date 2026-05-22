export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'researcher';
  created_at: string;
}
