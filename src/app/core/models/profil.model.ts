export interface Profil {
  id: number;
  libelle?: string;
  description?: string;
  statut?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProfilResponse {
  success: boolean;
  profils: Profil[];
  message?: string;
  error?: string;
}
