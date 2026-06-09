import { Commune } from './commune.model';

export interface Quartier {
  id: number;
  nom: string;
  commune_id: number;
  commune?: Commune; // La relation chargée depuis l'API
  created_at?: string;
  updated_at?: string;
}

export interface CreateQuartierDto {
  nom: string;
  commune_id: number;
}

export interface QuartierResponse {
  result?: Quartier[];
  meta?: {
    total: number;
    last_page?: number;
    lastPage?: number;
  };
  message?: string;
}