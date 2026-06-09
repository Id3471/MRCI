import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Commodite, CreateCommoditeDto } from '../../core/models/commodite.model';
import { CommoditeService } from '../../core/services/commodite/commodite.service';
import { CrudPage } from '../../Component/shared/crud-page/crud-page';
import { CrudColumn } from '../../core/models/crud.model';
import { ConfirmModal } from '../../Component/shared/confirm-modal/confirm-modal';
import { GenericModal } from '../../Component/shared/generic-modal/generic-modal';
import { Create } from '../../Component/commodite/create/create';
import { CommoditeEditPayload, Update } from '../../Component/commodite/update/update';

@Component({
  selector: 'app-commodite',
  standalone: true,
  imports: [CommonModule, FormsModule, CrudPage, ConfirmModal, GenericModal, Create, Update],
  templateUrl: './commodite.html',
  styleUrl: './commodite.css',
})
export class CommoditePage {
  commodites: Commodite[] = [];
  allCommodites: Commodite[] = [];
  displayedCommodites: Commodite[] = [];
  itemToEdit!: Commodite;

  searchTerm = '';

  isCreating = false;
  editFormData: Partial<CreateCommoditeDto> | null = null;

  createOpen = false;
  editOpen = false;
  editTargetId = 0;

  page = 1;
  perPage = 5;
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
    { key: 'libelle', label: 'Libellé', type: 'text' },
    { key: 'statut', label: 'Statut', type: 'boolean', trueLabel: 'Actif', falseLabel: 'Inactif' },
    { key: 'created_at', label: 'Date création', type: 'date' },
  ];

  constructor(
    private commoditeService: CommoditeService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadCommodites();
  }

  loadCommodites() {
    this.errorMessage = null;
    this.successMessage = null;

    const term = this.searchTerm.trim();
    if (term) {
      return this.loadSearchCommodites(term);
    }

    this.commoditeService.getPaginatedCommodites(this.perPage, this.page).subscribe({
      next: (res: any) => {
        const result = res?.result;
        const meta = res?.meta;

        this.commodites = Array.isArray(result) ? result : result ? [result] : [];
        this.displayedCommodites = this.commodites;
        this.allCommodites = [];

        if (meta) {
          this.total = meta.total ?? 0;
          this.lastPage = meta.last_page ?? meta.lastPage ?? 1;
        } else {
          this.total = this.commodites.length;
          this.lastPage = 1;
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ?? err?.message ?? 'Impossible de charger les commodités.';
        this.cd.detectChanges();
      },
    });
  }

  loadSearchCommodites(term: string) {
    this.errorMessage = null;
    this.successMessage = null;

    const filterResults = (items: Commodite[]) => {
      const search = term.toLowerCase();

      this.displayedCommodites = items.filter((c) => c.libelle?.toLowerCase().includes(search));

      this.total = this.displayedCommodites.length;
      this.lastPage = 1;
      this.page = 1;

      this.cd.detectChanges();
    };

    if (this.allCommodites.length) {
      return filterResults(this.allCommodites);
    }

    // Récupérer toutes les commodités si on cherche côté front
    this.commoditeService.getAllCommodites().subscribe({
      next: (res: any) => {
        const result = res?.result;
        this.allCommodites = Array.isArray(result) ? result : result ? [result] : [];
        filterResults(this.allCommodites);
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ??
          err?.message ??
          'Impossible de charger les données pour la recherche.';
        this.cd.detectChanges();
      },
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;

    if (this.searchTerm.trim()) {
      this.loadSearchCommodites(this.searchTerm.trim());
      return;
    }

    this.page = 1;
    this.loadCommodites();
  }

  onPerPageChange(value: number) {
    this.perPage = value;
    this.page = 1;
    this.loadCommodites();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadCommodites();
  }

  openCreate() {
    this.createOpen = true;
  }

  closeCreate() {
    this.createOpen = false;
  }

  onCreateSubmit(dto: CreateCommoditeDto) {
    if (this.isCreating) return;

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.commoditeService.createCommodite(dto).subscribe({
      next: () => {
        this.successMessage = 'Commodité ajoutée avec succès.';
        this.createOpen = false;
        this.isCreating = false;
        this.loadCommodites();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la création.';
        this.cd.detectChanges();
      },
    });
  }

  openEdit(c: Commodite) {
    this.itemToEdit = c;
    this.editTargetId = Number(c?.id);

    if (!this.editTargetId || this.editTargetId <= 0) {
      this.errorMessage = 'ID commodité invalide';
      return;
    }

    this.editFormData = {
      libelle: c.libelle,
    };

    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
    this.editFormData = null;
  }

  onEditSubmit(payload: CommoditeEditPayload) {
    this.errorMessage = null;
    this.successMessage = null;

    const { id, data } = payload;

    this.commoditeService.updateCommodite(id, data).subscribe({
      next: () => {
        this.successMessage = 'Commodité modifiée avec succès.';
        this.editOpen = false;
        this.loadCommodites();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la modification.';
      },
    });
  }

  openConfirmToggle(c: Commodite) {
    const isActive = c.statut;

    this.confirmtitre = isActive ? 'Désactiver la commodité' : 'Activer la commodité';
    this.confirmMessage = `Voulez-vous vraiment ${isActive ? 'désactiver' : 'activer'} la commodité "${c.libelle}" ?`;
    this.confirmButtonLabel = isActive ? 'Désactiver' : 'Activer';
    this.confirmColorClass = isActive
      ? 'bg-red-600 hover:bg-red-500'
      : 'bg-green-600 hover:bg-green-500';
    this.confirmAction = () => this.performToggleStatut(c);
    this.confirmOpen = true;
  }

  openConfirmDelete(c: Commodite) {
    this.confirmtitre = 'Supprimer la commodité';
    this.confirmMessage = `Voulez-vous vraiment supprimer la commodité "${c.libelle}" ?`;
    this.confirmButtonLabel = 'Supprimer';
    this.confirmColorClass = 'bg-red-600 hover:bg-red-500';
    this.confirmAction = () => this.performDeleteCommodite(c.id);
    this.confirmOpen = true;
    this.cd.detectChanges();
  }

  cancelConfirm() {
    this.confirmOpen = false;
    this.confirmAction = null;
  }

  performToggleStatut(c: Commodite) {
    this.errorMessage = null;
    this.successMessage = null;
    this.confirmOpen = false;
    this.confirmAction = null;

    const obs = c.statut
      ? this.commoditeService.deactivateCommodite(c.id)
      : this.commoditeService.activateCommodite(c.id);

    obs.subscribe({
      next: () => this.loadCommodites(),
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Action impossible.'),
    });
  }

  performDeleteCommodite(id: number) {
    this.errorMessage = null;
    this.successMessage = null;
    this.confirmOpen = false;
    this.confirmAction = null;

    this.commoditeService.deleteCommodite(id).subscribe({
      next: () => {
        this.successMessage = 'Commodité supprimée avec succès.';
        this.loadCommodites();
      },
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Suppression impossible.'),
    });
  }
}
