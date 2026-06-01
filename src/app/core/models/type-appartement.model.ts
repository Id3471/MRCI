export interface TypeAppartement {
  id: number;
  libelle: string;
  statut?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TypeAppartementResponse {
  result?: TypeAppartement[];
  success?: boolean;
  message?: string;
  error?: string;
}
