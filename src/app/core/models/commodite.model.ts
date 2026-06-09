export interface Commodite {
  id: number;
  libelle: string;
  statut: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateCommoditeDto {
  libelle: string;
}

export interface CommoditeResponse {
  result?: Commodite[];
  meta?: {
    total: number;
    last_page?: number;
    lastPage?: number;
  };
  message?: string;
}