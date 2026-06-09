import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateTypeAppartementDto, TypeAppartement } from '../../core/models/type-appartement.model';
import { TypeAppartementService } from '../../core/services/type-appartement/type-appartement.service';
import { ConfirmModal } from '../../Component/shared/confirm-modal/confirm-modal';
import { CrudPage } from '../../Component/shared/crud-page/crud-page';
import { GenericModal } from '../../Component/shared/generic-modal/generic-modal';
import { CreateTypeApt } from '../../Component/typeAppartement/create-type-apt/create-type-apt';
import { TypeEditPayload, UpdateTypeApt } from '../../Component/typeAppartement/update-type-apt/update-type-apt';
import { CrudColumn } from '../../core/models/crud.model';

@Component({
  selector: 'app-type-appartement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmModal,
    CrudPage,
    GenericModal,
    CreateTypeApt,
    UpdateTypeApt,
  ],
  templateUrl: './type-appartement.html',
  styleUrl: './type-appartement.css',
})
export class TypeAppartementPage {
  types: TypeAppartement[] = [];
  allTypes: TypeAppartement[] = [];
  displayedTypes: TypeAppartement[] = [];
  itemToEdit!: TypeAppartement;

  searchTerm = '';

  isCreating = false;
  editFormData: Partial<CreateTypeAppartementDto> | null = null;

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

  // L'ordre des colonnes suit celui du tableau Blade
  readonly tableColumns: CrudColumn[] = [
    { key: 'created_at', label: 'Date création', type: 'date' },
    { key: 'libelle', label: 'Libellé', type: 'text' },
    { key: 'statut', label: 'Statut', type: 'boolean', trueLabel: 'Actif', falseLabel: 'Inactif' },
  ];

  constructor(
    private typeService: TypeAppartementService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadTypes();
  }

  loadTypes() {
    this.errorMessage = null;
    this.successMessage = null;

    const term = this.searchTerm.trim();
    if (term) {
      return this.loadSearchTypes(term);
    }

    this.typeService.getPaginatedTypes(this.perPage, this.page).subscribe({
      next: (res: any) => {
        const result = res?.result;
        const meta = res?.meta;

        this.types = Array.isArray(result) ? result : result ? [result] : [];
        this.displayedTypes = this.types;
        this.allTypes = [];

        if (meta) {
          this.total = meta.total ?? 0;
          this.lastPage = meta.last_page ?? meta.lastPage ?? 1;
        } else {
          this.total = this.types.length;
          this.lastPage = 1;
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ?? err?.message ?? 'Impossible de charger les types.';
        this.cd.detectChanges();
      },
    });
  }

  loadSearchTypes(term: string) {
    this.errorMessage = null;
    this.successMessage = null;

    const filterResults = (items: TypeAppartement[]) => {
      const search = term.toLowerCase();

      this.displayedTypes = items.filter((t) => t.libelle?.toLowerCase().includes(search));

      this.total = this.displayedTypes.length;
      this.lastPage = 1;
      this.page = 1;

      this.cd.detectChanges();
    };

    if (this.allTypes.length) {
      return filterResults(this.allTypes);
    }

    this.typeService.getAllTypes().subscribe({
      next: (res: any) => {
        const result = res?.result;
        this.allTypes = Array.isArray(result) ? result : result ? [result] : [];
        filterResults(this.allTypes);
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
      this.loadSearchTypes(this.searchTerm.trim());
      return;
    }

    this.page = 1;
    this.loadTypes();
  }

  onPerPageChange(value: number) {
    this.perPage = value;
    this.page = 1;
    this.loadTypes();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadTypes();
  }

  openCreate() {
    this.createOpen = true;
  }

  closeCreate() {
    this.createOpen = false;
  }

  onCreateSubmit(dto: CreateTypeAppartementDto) {
    if (this.isCreating) return;

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.typeService.createType(dto).subscribe({
      next: () => {
        this.successMessage = 'Type ajouté avec succès.';
        this.createOpen = false;
        this.isCreating = false;
        this.loadTypes();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la création.';
        this.cd.detectChanges();
      },
    });
  }

  openEdit(t: TypeAppartement) {
    this.itemToEdit = t;
    this.editTargetId = Number(t?.id);

    if (!this.editTargetId || this.editTargetId <= 0) {
      this.errorMessage = 'ID type invalide';
      return;
    }

    this.editFormData = {
      libelle: t.libelle,
    };

    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
    this.editFormData = null;
  }

  onEditSubmit(payload: TypeEditPayload) {
    this.errorMessage = null;
    this.successMessage = null;

    const { id, data } = payload;

    this.typeService.updateType(id, data).subscribe({
      next: () => {
        this.successMessage = 'Type modifié avec succès.';
        this.editOpen = false;
        this.loadTypes();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la modification.';
      },
    });
  }

  openConfirmToggle(t: TypeAppartement) {
    const isActive = t.statut;

    this.confirmtitre = isActive ? 'Désactiver le type' : 'Activer le type';
    this.confirmMessage = `Voulez-vous vraiment ${isActive ? 'désactiver' : 'activer'} le type "${t.libelle}" ?`;
    this.confirmButtonLabel = isActive ? 'Désactiver' : 'Activer';
    this.confirmColorClass = isActive
      ? 'bg-red-600 hover:bg-red-500'
      : 'bg-green-600 hover:bg-green-500';
    this.confirmAction = () => this.performToggleStatut(t);
    this.confirmOpen = true;
  }

  openConfirmDelete(t: TypeAppartement) {
    this.confirmtitre = 'Supprimer le type';
    this.confirmMessage = `Voulez-vous vraiment supprimer le type "${t.libelle}" ?`;
    this.confirmButtonLabel = 'Supprimer';
    this.confirmColorClass = 'bg-red-600 hover:bg-red-500';
    this.confirmAction = () => this.performDeleteType(t.id);
    this.confirmOpen = true;
    this.cd.detectChanges();
  }

  cancelConfirm() {
    this.confirmOpen = false;
    this.confirmAction = null;
  }

  performToggleStatut(t: TypeAppartement) {
    this.errorMessage = null;
    this.successMessage = null;
    this.confirmOpen = false;
    this.confirmAction = null;

    const obs = t.statut
      ? this.typeService.deactivateType(t.id)
      : this.typeService.activateType(t.id);

    obs.subscribe({
      next: () => this.loadTypes(),
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Action impossible.'),
    });
  }

  performDeleteType(id: number) {
    this.errorMessage = null;
    this.successMessage = null;
    this.confirmOpen = false;
    this.confirmAction = null;

    this.typeService.deleteType(id).subscribe({
      next: () => {
        this.successMessage = 'Type supprimé avec succès.';
        this.loadTypes();
      },
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Suppression impossible.'),
    });
  }
}
