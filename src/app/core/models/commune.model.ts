export interface Commune {
  id: number;
  nom?: string;
  libelle?: string;
  statut?: boolean;
}

export interface CreateCommuneDTO {
  libelle?: string;
}

export interface CommuneResponse {
  result?: Commune[];
  success?: boolean;
  message?: string;
  error?: string;
}
