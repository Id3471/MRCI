export interface Commune {
  id: number;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCommuneDto {
  nom: string;
}

export interface CommuneResponse {
  result?: Commune[];
  meta?: {
    total: number;
    last_page?: number;
    lastPage?: number;
  };
  message?: string;
}