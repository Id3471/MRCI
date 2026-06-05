import { CommonModule } from '@angular/common';

import { ChangeDetectorRef, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Residence as ResidenceModel, CreateResidenceDto } from '../../core/models/residence.model';

import { ResidenceService } from '../../core/services/residence/residence.service';

import { ResidenceCreateModalComponent } from '../../Component/residence/residence-create-modal/residence-create-modal';

import {
  ResidenceEditModalComponent,
  ResidenceEditPayload,
} from '../../Component/residence/residence-edit-modal/residence-edit-modal';

import { API_CONFIG } from '../../core/config/api.config';

import { PageHeader } from '../../Component/page-header/page-header';

@Component({
  selector: 'app-residence',

  imports: [
    CommonModule,

    FormsModule,

    PageHeader,

    ResidenceCreateModalComponent,

    ResidenceEditModalComponent,
  ],

  templateUrl: './residence.html',

  styleUrl: './residence.css',
})
export class Residence {
  residences: ResidenceModel[] = [];

  allResidences: ResidenceModel[] = [];

  displayedResidences: ResidenceModel[] = [];

  searchTerm = '';

  backUrl = `${API_CONFIG.backUrl}/`;

  isCreating = false;

  editLogoUrl: string | null = null;

  resitoedit!: ResidenceModel;

  // UI state

  createOpen = false;

  editOpen = false;

  editTargetId = 0;

  // Pagination

  page = 1;

  perPage = 5;

  total = 0;

  lastPage = 1;

  // Alerts

  errorMessage: string | null = null;

  successMessage: string | null = null;

  // Confirmation box

  confirmOpen = false;

  confirmTitle = '';

  confirmMessage = '';

  confirmButtonLabel = 'Confirmer';

  confirmAction: (() => void) | null = null;

  // Edit form data

  editFormData: Partial<CreateResidenceDto> | null = null;

  constructor(
    private residenceService: ResidenceService,

    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadResidences();
  }

  loadResidences() {
    this.errorMessage = null;

    this.successMessage = null;

    if (this.searchTerm.trim()) {
      return this.loadSearchResidences(this.searchTerm.trim());
    }

    this.residenceService.getNbResidences(this.perPage, this.page).subscribe({
      next: (res: any) => {
        const result = res?.result;

        this.residences = Array.isArray(result) ? result : result ? [result] : [];

        this.displayedResidences = this.residences;

        this.allResidences = [];

        const meta = res?.meta;

        if (meta) {
          this.total = meta.total ?? 0;

          this.lastPage = meta.last_page ?? meta.lastPage ?? 1;
        } else {
          this.total = this.residences.length;

          this.lastPage = 1;
        }

        this.cd.detectChanges();
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message ?? err?.message ?? 'Impossible de charger les résidences.';

        this.cd.detectChanges();
      },
    });
  }

  loadSearchResidences(term: string) {
    this.errorMessage = null;

    this.successMessage = null;

    const filterResults = (items: ResidenceModel[]) => {
      const search = term.toLowerCase();

      this.displayedResidences = items.filter((r) =>
        [r.nom, r.email, r.contact, r.code, r.manager]

          .filter(Boolean)

          .some((value) => value.toLowerCase().includes(search)),
      );

      this.total = this.displayedResidences.length;

      this.lastPage = 1;

      this.page = 1;

      this.cd.detectChanges();
    };

    if (this.allResidences.length) {
      return filterResults(this.allResidences);
    }

    this.residenceService.getAbsAllResidences().subscribe({
      next: (res: any) => {
        const result = res?.result;

        this.allResidences = Array.isArray(result) ? result : result ? [result] : [];

        filterResults(this.allResidences);
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message ??
          err?.message ??
          'Impossible de charger les résidences pour la recherche.';

        this.cd.detectChanges();
      },
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;

    if (this.searchTerm.trim()) {
      this.loadSearchResidences(this.searchTerm.trim());
    } else {
      this.page = 1;

      this.loadResidences();
    }
  }

  onPerPageChange(value: number) {
    this.perPage = value;

    this.page = 1;

    this.loadResidences();
  }

  goPrevPage() {
    if (this.page <= 1) return;

    this.page -= 1;

    this.loadResidences();
  }

  goNextPage() {
    if (this.page >= this.lastPage) return;

    this.page += 1;

    this.loadResidences();
  }

  openCreate() {
    this.createOpen = true;
  }

  closeCreate() {
    this.createOpen = false;
  }

  onCreateSubmit(dto: CreateResidenceDto) {
    if (this.isCreating) return;

    this.isCreating = true;

    this.errorMessage = null;

    this.successMessage = null;

    this.residenceService.createResidence(dto).subscribe({
      next: (res) => {
        this.successMessage = 'Résidence créée avec succès.';

        this.createOpen = false;

        this.loadResidences();

        this.isCreating = false;

        this.cd.detectChanges();
      },

      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la création.';

        this.createOpen = false;

        this.cd.detectChanges();
      },
    });
  }

  openEdit(r: ResidenceModel) {
    this.resitoedit = r;

    this.editTargetId = Number(r?.id);

    if (!this.editTargetId || this.editTargetId <= 0) {
      this.errorMessage = 'ID résidence invalide';

      return;
    }

    this.editFormData = {
      denomination: r.nom,

      contact: r.contact,

      email: r.email,

      manager: r.manager,
    };

    this.editLogoUrl = r.logo ? `${this.backUrl}residenceLogo/${r.logo}` : null;

    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;

    this.editFormData = null;

    this.editLogoUrl = null;
  }

  onEditSubmit(payload: ResidenceEditPayload) {
    this.errorMessage = null;

    this.successMessage = null;

    const { id, data } = payload;

    this.residenceService.updateResidence(id, data).subscribe({
      next: () => {
        this.successMessage = 'Résidence modifiée avec succès.';

        this.editOpen = false;

        this.loadResidences();
      },

      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la modification.';
      },
    });
  }

  openConfirmToggle(r: ResidenceModel) {
    this.confirmTitle = r.statut ? 'Désactiver la résidence' : 'Activer la résidence';

    this.confirmMessage = r.statut
      ? `Voulez-vous vraiment désactiver la résidence "${r.nom}" ?`
      : `Voulez-vous vraiment activer la résidence "${r.nom}" ?`;

    this.confirmButtonLabel = r.statut ? 'Désactiver' : 'Activer';

    this.confirmAction = () => this.performToggleStatut(r);

    this.confirmOpen = true;
  }

  openConfirmDelete(r: ResidenceModel) {
    this.confirmTitle = 'Supprimer la résidence';

    this.confirmMessage = `Voulez-vous vraiment supprimer la résidence "${r.nom}" ?`;

    this.confirmButtonLabel = 'Supprimer';

    this.confirmAction = () => this.performDeleteResidence(r.id);

    this.confirmOpen = true;

    this.cd.detectChanges();
  }

  cancelConfirm() {
    this.confirmOpen = false;

    this.confirmAction = null;
  }

  performToggleStatut(r: ResidenceModel) {
    this.errorMessage = null;

    this.successMessage = null;

    this.confirmOpen = false;

    this.confirmAction = null;

    const obs = r.statut
      ? this.residenceService.deactivateResidence(r.id)
      : this.residenceService.activateResidence(r.id);

    obs.subscribe({
      next: () => this.loadResidences(),

      error: (err) => (this.errorMessage = err?.error?.message ?? 'Action impossible.'),
    });
  }

  performDeleteResidence(id: number) {
    this.errorMessage = null;

    this.successMessage = null;

    this.confirmOpen = false;

    this.confirmAction = null;

    this.residenceService.deleteResidence(id).subscribe({
      next: () => {
        this.successMessage = 'Résidence supprimée avec succès.';

        this.loadResidences();
      },

      error: (err) => (this.errorMessage = err?.error?.message ?? 'Suppression impossible.'),
    });
  }

  isActive(r: ResidenceModel) {
    return r.statut === true;
  }
}
