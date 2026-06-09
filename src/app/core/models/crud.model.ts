export interface CrudColumn {
  key: string;
  label: string;
  type: 'text' | 'image' | 'boolean' | 'date' | 'number';
  // Options spécifiques pour les images
  imageUrlPrefix?: string;
  fallbackText?: string;
  // Options spécifiques pour les booléens
  trueLabel?: string;
  falseLabel?: string;
}

export interface CrudActionsConfig {
  canEdit?: boolean;
  canDelete?: boolean;
  canToggle?: boolean; // Pour activer/désactiver
  toggleKey?: string;  // La propriété booléenne à vérifier pour le toggle (ex: 'statut')
}