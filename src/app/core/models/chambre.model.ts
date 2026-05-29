export interface ResidenceSummary {
  id: number;
  nom: string;
  email?: string;
  contact?: string;
  manager?: string;
  code?: string;
  statut?: boolean;
  logo?: string;
}

export interface Commune {
  id: number;
  nom?: string;
}

export interface Quartier {
  id: number;
  nom?: string;
}

export interface ChambreType {
  id?: number;
  type?: string;
}

export interface ChambreImage {
  id?: number;
  path?: string;
}

export interface Chambre {
  id: number;
  code: string;
  prix: number;
  statut: boolean;
  description: string;
  longitude?: number;
  latitude?: number;
  adresse?: string;
  rue?: string;
  image_principale?: string;
  residence?: ResidenceSummary;
  commune?: Commune;
  quartier?: Quartier;
  type?: ChambreType;
  images?: ChambreImage[];
  moyenne?: number;
  total_avis?: number;
  distance?: number;
  commodites?: any[];
}

export interface ChambreResponse {
  success: boolean;
  result?: Chambre | Chambre[] | { chambre?: Chambre; commodite?: any[] };
  message?: string;
  error?: string;
}

export interface ChambreSearchParams {
  searchTerm?: string;
}

export interface ChambreProchesParams {
  latitude: number;
  longitude: number;
}
