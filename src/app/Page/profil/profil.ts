import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateProfilDto, Profil } from '../../core/models/profil.model';
import { ProfilService } from '../../core/services/profil/profil.service';
import { ConfirmModal } from "../../Component/shared/confirm-modal/confirm-modal";
import { GenericModal } from "../../Component/shared/generic-modal/generic-modal";
import { CrudPage } from "../../Component/shared/crud-page/crud-page";
import { CreateProfil } from "../../Component/profil/create-profil/create-profil";
import { ProfilEditPayload, UpdateProfil } from "../../Component/profil/update-profil/update-profil";
import { CrudColumn } from '../../core/models/crud.model';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModal, GenericModal, CrudPage, CreateProfil, UpdateProfil],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilPage {
  profils: Profil[] = [];
  allProfils: Profil[] = [];
  displayedProfils: Profil[] = [];
  itemToEdit!: Profil;

  searchTerm = '';

  isCreating = false;
  editFormData: Partial<CreateProfilDto> | null = null;

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
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'statut', label: 'Statut', type: 'boolean', trueLabel: 'Actif', falseLabel: 'Inactif' },
  ];

  constructor(
    private profilService: ProfilService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadProfils();
  }

  loadProfils() {
    this.errorMessage = null;
    this.successMessage = null;

    const term = this.searchTerm.trim();
    if (term) {
      return this.loadSearchProfils(term);
    }

    this.profilService.getPaginatedProfils(this.perPage, this.page).subscribe({
      next: (res: any) => {
        const result = res?.result;
        const meta = res?.meta;

        this.profils = Array.isArray(result) ? result : result ? [result] : [];
        this.displayedProfils = this.profils;
        this.allProfils = [];

        if (meta) {
          this.total = meta.total ?? 0;
          this.lastPage = meta.last_page ?? meta.lastPage ?? 1;
        } else {
          this.total = this.profils.length;
          this.lastPage = 1;
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Impossible de charger les profils.';
        this.cd.detectChanges();
      },
    });
  }

  loadSearchProfils(term: string) {
    this.errorMessage = null;
    this.successMessage = null;

    const filterResults = (items: Profil[]) => {
      const search = term.toLowerCase();

      this.displayedProfils = items.filter((p) =>
        p.libelle?.toLowerCase().includes(search) || 
        p.description?.toLowerCase().includes(search)
      );

      this.total = this.displayedProfils.length;
      this.lastPage = 1;
      this.page = 1;

      this.cd.detectChanges();
    };

    if (this.allProfils.length) {
      return filterResults(this.allProfils);
    }

    this.profilService.getAllProfils().subscribe({
      next: (res: any) => {
        const result = res?.result;
        this.allProfils = Array.isArray(result) ? result : result ? [result] : [];
        filterResults(this.allProfils);
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
      this.loadSearchProfils(this.searchTerm.trim());
      return;
    }

    this.page = 1;
    this.loadProfils();
  }

  onPerPageChange(value: number) {
    this.perPage = value;
    this.page = 1;
    this.loadProfils();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadProfils();
  }

  openCreate() {
    this.createOpen = true;
  }

  closeCreate() {
    this.createOpen = false;
  }

  onCreateSubmit(dto: CreateProfilDto) {
    if (this.isCreating) return;

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.profilService.createProfil(dto).subscribe({
      next: () => {
        this.successMessage = 'Profil ajouté avec succès.';
        this.createOpen = false;
        this.isCreating = false;
        this.loadProfils();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la création.';
        this.cd.detectChanges();
      },
    });
  }

  openEdit(p: Profil) {
    this.itemToEdit = p;
    this.editTargetId = Number(p?.id);

    if (!this.editTargetId || this.editTargetId <= 0) {
      this.errorMessage = 'ID profil invalide';
      return;
    }

    this.editFormData = {
      profil_name: p.libelle,
      description: p.description
    };

    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
    this.editFormData = null;
  }

  onEditSubmit(payload: ProfilEditPayload) {
    this.errorMessage = null;
    this.successMessage = null;

    const { id, data } = payload;

    this.profilService.updateProfil(id, data).subscribe({
      next: () => {
        this.successMessage = 'Profil modifié avec succès.';
        this.editOpen = false;
        this.loadProfils();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la modification.';
      },
    });
  }

  openConfirmToggle(p: Profil) {
    const isActive = p.statut;

    this.confirmtitre = isActive ? 'Désactiver le profil' : 'Activer le profil';
    this.confirmMessage = `Voulez-vous vraiment ${isActive ? 'désactiver' : 'activer'} le profil "${p.libelle}" ?`;
    this.confirmButtonLabel = isActive ? 'Désactiver' : 'Activer';
    this.confirmColorClass = isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500';
    this.confirmAction = () => this.performToggleStatut(p);
    this.confirmOpen = true;
  }

  openConfirmDelete(p: Profil) {
    this.confirmtitre = 'Supprimer le profil';
    this.confirmMessage = `Voulez-vous vraiment supprimer le profil "${p.libelle}" ?`;
    this.confirmButtonLabel = 'Supprimer';
    this.confirmColorClass = 'bg-red-600 hover:bg-red-500';
    this.confirmAction = () => this.performDeleteProfil(p.id);
    this.confirmOpen = true;
    this.cd.detectChanges();
  }

  cancelConfirm() {
    this.confirmOpen = false;
    this.confirmAction = null;
  }

  performToggleStatut(p: Profil) {
    this.errorMessage = null;
    this.successMessage = null;
    this.confirmOpen = false;
    this.confirmAction = null;

    const obs = p.statut
      ? this.profilService.deactivateProfil(p.id)
      : this.profilService.activateProfil(p.id);

    obs.subscribe({
      next: () => this.loadProfils(),
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Action impossible.'),
    });
  }

  performDeleteProfil(id: number) {
    this.errorMessage = null;
    this.successMessage = null;
    this.confirmOpen = false;
    this.confirmAction = null;

    this.profilService.deleteProfil(id).subscribe({
      next: () => {
        this.successMessage = 'Profil supprimé avec succès.';
        this.loadProfils();
      },
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Suppression impossible.'),
    });
  }
}
