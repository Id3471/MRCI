import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Commune, CreateCommuneDto } from '../../core/models/commune.model';
import { CommuneService } from '../../core/services/commune/commune.service';
import { CrudPage } from "../../Component/shared/crud-page/crud-page";
import { GenericModal } from "../../Component/shared/generic-modal/generic-modal";
import { CommuneCreateModal } from "../../Component/commune/commune-create-modal/commune-create-modal";
import { CommuneEditModal, CommuneEditPayload } from "../../Component/commune/commune-edit-modal/commune-edit-modal";
import { ConfirmModal } from "../../Component/shared/confirm-modal/confirm-modal";
import { CrudColumn } from '../../core/models/crud.model';

@Component({
  selector: 'app-commune',
  standalone: true,
  imports: [CommonModule, FormsModule, CrudPage, GenericModal, CommuneCreateModal, CommuneEditModal, ConfirmModal],
  templateUrl: './commune.html',
  styleUrl: './commune.css',
})
export class CommunePage {
  communes: Commune[] = [];
  allCommunes: Commune[] = [];
  displayedCommunes: Commune[] = [];
  itemToEdit!: Commune;

  searchTerm = '';

  isCreating = false;
  editFormData: Partial<CreateCommuneDto> | null = null;

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

  // Configuration des colonnes affichées dans la table
  readonly tableColumns: CrudColumn[] = [
    { key: 'nom', label: 'Libellé', type: 'text' },
  ];

  constructor(
    private communeService: CommuneService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadCommunes();
  }

  loadCommunes() {
    this.errorMessage = null;
    this.successMessage = null;

    const term = this.searchTerm.trim();
    if (term) {
      return this.loadSearchCommunes(term);
    }

    this.communeService.getPaginatedCommunes(this.perPage, this.page).subscribe({
      next: (res: any) => {
        const result = res?.result;
        const meta = res?.meta;

        this.communes = Array.isArray(result) ? result : result ? [result] : [];
        this.displayedCommunes = this.communes;
        this.allCommunes = [];

        if (meta) {
          this.total = meta.total ?? 0;
          this.lastPage = meta.last_page ?? meta.lastPage ?? 1;
        } else {
          this.total = this.communes.length;
          this.lastPage = 1;
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Impossible de charger les communes.';
        this.cd.detectChanges();
      },
    });
  }

  loadSearchCommunes(term: string) {
    this.errorMessage = null;
    this.successMessage = null;

    const filterResults = (items: Commune[]) => {
      const search = term.toLowerCase();

      this.displayedCommunes = items.filter((c) =>
        c.nom?.toLowerCase().includes(search)
      );

      this.total = this.displayedCommunes.length;
      this.lastPage = 1;
      this.page = 1;

      this.cd.detectChanges();
    };

    if (this.allCommunes.length) {
      return filterResults(this.allCommunes);
    }

    this.communeService.getAllCommunes().subscribe({
      next: (res: any) => {
        const result = res?.result;
        this.allCommunes = Array.isArray(result) ? result : result ? [result] : [];
        filterResults(this.allCommunes);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Impossible de charger les données pour la recherche.';
        this.cd.detectChanges();
      },
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;

    if (this.searchTerm.trim()) {
      this.loadSearchCommunes(this.searchTerm.trim());
      return;
    }

    this.page = 1;
    this.loadCommunes();
  }

  onPerPageChange(value: number) {
    this.perPage = value;
    this.page = 1;
    this.loadCommunes();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadCommunes();
  }

  openCreate() {
    this.createOpen = true;
  }

  closeCreate() {
    this.createOpen = false;
  }

  onCreateSubmit(dto: CreateCommuneDto) {
    if (this.isCreating) return;

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.communeService.createCommune(dto).subscribe({
      next: () => {
        this.successMessage = 'Commune ajoutée avec succès.';
        this.createOpen = false;
        this.isCreating = false;
        this.loadCommunes();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la création.';
        this.cd.detectChanges();
      },
    });
  }

  openEdit(c: Commune) {
    this.itemToEdit = c;
    this.editTargetId = Number(c?.id);

    if (!this.editTargetId || this.editTargetId <= 0) {
      this.errorMessage = 'ID commune invalide';
      return;
    }

    this.editFormData = {
      nom: c.nom,
    };

    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
    this.editFormData = null;
  }

  onEditSubmit(payload: CommuneEditPayload) {
    this.errorMessage = null;
    this.successMessage = null;

    const { id, data } = payload;

    this.communeService.updateCommune(id, data).subscribe({
      next: () => {
        this.successMessage = 'Commune modifiée avec succès.';
        this.editOpen = false;
        this.loadCommunes();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la modification.';
      },
    });
  }

  openConfirmDelete(c: Commune) {
    this.confirmtitre = 'Supprimer la commune';
    this.confirmMessage = `Voulez-vous vraiment supprimer la commune "${c.nom}" ?`;
    this.confirmButtonLabel = 'Supprimer';
    this.confirmColorClass = 'bg-red-600 hover:bg-red-500';
    this.confirmAction = () => this.performDeleteCommune(c.id);
    this.confirmOpen = true;
    this.cd.detectChanges();
  }

  cancelConfirm() {
    this.confirmOpen = false;
    this.confirmAction = null;
  }

  performDeleteCommune(id: number) {
    this.errorMessage = null;
    this.successMessage = null;
    this.confirmOpen = false;
    this.confirmAction = null;

    this.communeService.deleteCommune(id).subscribe({
      next: () => {
        this.successMessage = 'Commune supprimée avec succès.';
        this.loadCommunes();
      },
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Suppression impossible.'),
    });
  }
}
