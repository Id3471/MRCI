export interface Profil {
  id: number;
  libelle: string;
  description?: string;
  statut: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProfilDto {
  profil_name: string;
  description?: string;
}

export interface ProfilResponse {
  result?: Profil[];
  meta?: {
    total: number;
    last_page?: number;
    lastPage?: number;
  };
  message?: string;
}