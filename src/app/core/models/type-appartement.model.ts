export interface TypeAppartement {
  id: number;
  libelle: string;
  statut: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateTypeAppartementDto {
  libelle: string;
}

export interface TypeAppartementResponse {
  result?: TypeAppartement[];
  meta?: {
    total: number;
    last_page?: number;
    lastPage?: number;
  };
  message?: string;
}
