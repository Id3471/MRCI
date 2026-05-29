export interface Commodite {
  id: number;
  libelle?: string;
  statut?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CommoditeResponse {
  success: boolean;
  commodites: Commodite[];
  message?: string;
  error?: string;
}

