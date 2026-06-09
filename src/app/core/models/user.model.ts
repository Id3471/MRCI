import { Profil } from './profil.model';

export interface User {
  id: number;
  name: string;
  email: string;
  residence_id: number | null;
  statut: boolean;
  profil?: Profil;
  profilLabel?: string; // Propriété calculée pour l'affichage dans le tableau
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserDto {
  nom: string;
  email: string;
  // associationId?: number | null; // Utilisé dans le formulaire d'ajout Blade
  residenceId?: number | null;
}

export interface UserResponse {
  result: User | User[];
  meta?: {
    total: number;
    last_page: number;
    per_page: number;
    current_page: number;
  };
  message?: string;
}