import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmModal } from '../../Component/shared/confirm-modal/confirm-modal';
import { GenericModal } from '../../Component/shared/generic-modal/generic-modal';
import { CreateApt } from '../../Component/appartement/create-apt/create-apt';
import { CrudPage } from '../../Component/shared/crud-page/crud-page';
import { CrudColumn } from '../../core/models/crud.model';
import { AppartementService } from '../../core/services/chambre/chambre.service';
import { Appartement } from '../../core/models/chambre.model';
import { TypeAppartementService } from '../../core/services/type-appartement/type-appartement.service';
import { CommuneService } from '../../core/services/commune/commune.service';
import { ResidenceService } from '../../core/services/residence/residence.service';
import { QuartierService } from '../../core/services/quartier/quartier.service';
import { CommoditeService } from '../../core/services/commodite/commodite.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-appartement',
  imports: [ConfirmModal, GenericModal, CreateApt, CrudPage],
  templateUrl: './appartement.html',
  styleUrl: './appartement.css',
})
export class Appartements implements OnInit {
  appartements: Appartement[] = [];
  displayedAppartements: Appartement[] = [];


  // Listes pour les sélecteurs du formulaire
  typesList: any[] = [];
  residencesList: any[] = [];
  communesList: any[] = [];
  quartiersList: any[] = [];
  commoditesList: any[] = [];

  searchTerm = '';
  isCreating = false;
  createOpen = false;

  page = 1;
  perPage = 10;
  total = 0;
  lastPage = 1;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  confirmOpen = false;
  confirmtitre = '';
  confirmMessage = '';
  confirmButtonLabel = 'Confirmer';
  confirmColorClass = 'bg-red-600 hover:bg-red-500';
  confirmAction: (() => void) | null = null;

  readonly tableColumns: CrudColumn[] = [
    { key: 'code', label: 'Code', type: 'text' },
    { key: 'nombre_piece', label: 'Pièces', type: 'text' },
    { key: 'prix', label: 'Prix (FCFA)', type: 'number' },
    { key: 'statut', label: 'Statut', type: 'boolean', trueLabel: 'Actif', falseLabel: 'Inactif' },
    { key: 'created_at', label: 'Date création', type: 'date' },
  ];

  constructor(
    private appartementService: AppartementService,
    private typeService: TypeAppartementService, 
    private residenceService: ResidenceService,
    private communeService: CommuneService,
    private quartierService: QuartierService,
    private commoditeService: CommoditeService,
    private cd: ChangeDetectorRef,

  ) {}

  ngOnInit() {
    this.loadAppartements();
    this.loadDependencies();
  }

  loadDependencies() {
    forkJoin({
      residences: this.residenceService.getAbsAllResidences(),
      communes: this.communeService.getAllCommunes(),
      quartiers: this.quartierService.getAllQuartiers(),
      commodites: this.commoditeService.getAllCommodites(),
      types: this.typeService.getAllTypes() 
    }).subscribe({
      next: (data) => {
        this.residencesList = data.residences.result as any[] ?? [];
        this.typesList = data.types.result ?? [];
        this.communesList = data.communes.result ?? [];
        this.quartiersList = data.quartiers.result ?? [];
        this.commoditesList = data.commodites.result ?? [];
        this.cd.detectChanges();
      },
      error: (err) => console.error("Erreur chargement dépendances", err)
    });
  }

  loadAppartements() {
    this.errorMessage = null;
    this.appartementService.getPaginated(this.perPage, this.page).subscribe({
      next: (res: any) => {
        this.appartements = Array.isArray(res?.result) ? res.result : [];
        this.displayedAppartements = this.appartements;
        if (res?.meta) {
          this.total = res.meta.total ?? 0;
          this.lastPage = res.meta.last_page ?? res.meta.lastPage ?? 1;
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erreur lors du chargement des appartements.';
      },
    });
  }

  // Fonctions de pagination et de recherche (identiques aux composants précédents)
  onSearchChange(value: string) {
    /* ... */
  }
  onPerPageChange(value: number) {
    this.perPage = value;
    this.page = 1;
    this.loadAppartements();
  }
  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadAppartements();
  }

  openCreate() {
    this.createOpen = true;
  }
  closeCreate() {
    this.createOpen = false;
  }

  onCreateSubmit(formData: FormData) {
    if (this.isCreating) return;
    this.isCreating = true;

    this.appartementService.createAppartement(formData).subscribe({
      next: () => {
        this.successMessage = 'Appartement ajouté avec succès.';
        this.createOpen = false;
        this.isCreating = false;
        this.loadAppartements();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage = err?.error?.message || 'Erreur lors de la création.';
      },
    });
  }

  // Fonctions standard pour Supprimer et Activer/Désactiver (openConfirmToggle, openConfirmDelete...)
  openConfirmToggle(a: Appartement) {
    const isActive = a.statut;
    this.confirmtitre = isActive ? 'Désactiver' : 'Activer';
    this.confirmMessage = `Voulez-vous vraiment ${isActive ? 'désactiver' : 'activer'} l'appartement ${a.code} ?`;
    this.confirmButtonLabel = isActive ? 'Désactiver' : 'Activer';
    this.confirmColorClass = isActive
      ? 'bg-red-600 hover:bg-red-500'
      : 'bg-green-600 hover:bg-green-500';
    this.confirmAction = () => {
      this.confirmOpen = false;
      const obs = isActive
        ? this.appartementService.deactivateAppartement(a.id)
        : this.appartementService.activateAppartement(a.id);
      obs.subscribe(() => this.loadAppartements());
    };
    this.confirmOpen = true;
  }

  openConfirmDelete(a: Appartement) {
    this.confirmtitre = 'Supprimer';
    this.confirmMessage = `Supprimer l'appartement ${a.code} ?`;
    this.confirmButtonLabel = 'Supprimer';
    this.confirmAction = () => {
      this.confirmOpen = false;
      this.appartementService.deleteAppartement(a.id).subscribe(() => this.loadAppartements());
    };
    this.confirmOpen = true;
  }

  cancelConfirm() {
    this.confirmOpen = false;
  }
}
