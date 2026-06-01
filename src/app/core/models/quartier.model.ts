export interface Quartier {
  id: number;
  nom?: string;
  commune_id?: number;
  statut?: boolean;
  commune?: { id?: number; nom?: string } | null;
}

export interface QuartierResponse {
  result?: Quartier[];
  success?: boolean;
  message?: string;
  error?: string;
}
