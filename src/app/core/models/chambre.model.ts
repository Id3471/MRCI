export interface Appartement {
  id: number;
  code: string;
  type_id: number;
  residence_id?: number;
  nombre_piece: number;
  prix: number;
  description: string;
  commune_id: number;
  quartier_id: number;
  adresse: string;
  rue: string;
  longitude: string;
  latitude: string;
  statut: boolean;
  image?: string;
  images?: any[]; // Galerie
  commodites?: any[];
  created_at: string;
}

export interface AppartementResponse {
  result?: Appartement | Appartement[];
  meta?: { total: number; last_page?: number; lastPage?: number };
  message?: string;
}