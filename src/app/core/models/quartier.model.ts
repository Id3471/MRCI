export interface Quartier {
  id: number;
  nom?: string;
  commune_id?: number;
  statut?: boolean;
}

export interface QuartierResponse {
  result?: Quartier[];
  success?: boolean;
  message?: string;
  error?: string;
}
