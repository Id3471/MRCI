import { Profil } from './profil.model';

export interface User {
  id: number;
  name: string;
  email: string;
  residence_id?: number;
  profil_id?: number;
  profil?: Profil | null;
  statut?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  success: boolean;
  users: User[];
  message?: string;
  error?: string;
}
