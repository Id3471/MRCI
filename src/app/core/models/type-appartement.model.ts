export interface TypeAppartement {
  id: number;
  libelle: string;
  statut?: boolean;
}

export interface TypeAppartementResponse {
  result?: TypeAppartement[];
  success?: boolean;
  message?: string;
  error?: string;
}
