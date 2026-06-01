export interface Commune {
  id: number;
  libelle: string;
}

export interface Quartier {
  id: number;
  libelle: string;
  commune_id: number;
}

export interface Residence {
  id: number;
  nom: string;
  email: string;
  contact: string;
  manager: string;
  code: string;
  statut: boolean;
  logo?: string;
  commune?: Commune;
  quartier?: Quartier;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateResidenceDto {
  denomination: string;
  contact: string;
  email: string;
  manager: string;
  country_code?: string;
  full_phone?: string;
  logo?: File;
}

export interface ResidenceResponse {
  success: boolean;
  result?: Residence | Residence[];
  message?: string;
  error?: string;
}
