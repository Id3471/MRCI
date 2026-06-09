import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateQuartierDto, Quartier } from '../../core/models/quartier.model';
import { QuartierService } from '../../core/services/quartier/quartier.service';
import { CommuneService } from '../../core/services/commune/commune.service';
import { Commune } from '../../core/models/commune.model';
import { ConfirmModal } from "../../Component/shared/confirm-modal/confirm-modal";
import { GenericModal } from "../../Component/shared/generic-modal/generic-modal";
import { CrudPage } from "../../Component/shared/crud-page/crud-page";
import { CreateQuartier } from "../../Component/quartier/create-quartier/create-quartier";
import { QuartierEditPayload, UpdateQuartier } from "../../Component/quartier/update-quartier/update-quartier";
import { CrudColumn } from '../../core/models/crud.model';

@Component({
  selector: 'app-quartier',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModal, GenericModal, CrudPage, CreateQuartier, UpdateQuartier],
  templateUrl: './quartier.html',
  styleUrl: './quartier.css',
})
export class QuartierPage {
  quartiers: Quartier[] = [];
  allQuartiers: Quartier[] = [];
  displayedQuartiers: any[] = []; // type any car on va aplatir l'objet commune pour l'affichage
  itemToEdit!: Quartier;

  communesList: Commune[] = []; // Liste des communes pour les selects

  searchTerm = '';

  isCreating = false;
  editFormData: Partial<CreateQuartierDto> | null = null;

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

  // Remarquez la clé "commune_nom" qui sera injectée lors du formatage
  readonly tableColumns: CrudColumn[] = [
    { key: 'nom', label: 'Quartier', type: 'text' },
    { key: 'commune_nom', label: 'Commune', type: 'text' },
  ];

  constructor(
    private quartierService: QuartierService,
    private communeService: CommuneService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadCommunes();
    // this.loadQuartiers();
  }

  // On charge toutes les communes une seule fois pour les modales
  loadCommunes() {
    this.communeService.getAllCommunes().subscribe({
      next: (res: any) => {
        const result = res?.result;
        this.communesList = Array.isArray(result) ? result : result ? [result] : [];
        this.loadQuartiers();
      }
    });
  }

  loadQuartiers() {
    this.errorMessage = null;
    this.successMessage = null;

    const term = this.searchTerm.trim();
    if (term) {
      return this.loadSearchQuartiers(term);
    }

    this.quartierService.getPaginatedQuartiers(this.perPage, this.page).subscribe({
      next: (res: any) => {
        const result = res?.result;
        const meta = res?.meta;

        this.quartiers = Array.isArray(result) ? result : result ? [result] : [];
        this.displayedQuartiers = this.formatDataForTable(this.quartiers);
        this.allQuartiers = [];

        if (meta) {
          this.total = meta.total ?? 0;
          this.lastPage = meta.last_page ?? meta.lastPage ?? 1;
        } else {
          this.total = this.quartiers.length;
          this.lastPage = 1;
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Impossible de charger les quartiers.';
        this.cd.detectChanges();
      },
    });
  }

  loadSearchQuartiers(term: string) {
    this.errorMessage = null;
    this.successMessage = null;

    const filterResults = (items: Quartier[]) => {
      const search = term.toLowerCase();

      const filtered = items.filter((q) =>
        q.nom?.toLowerCase().includes(search) || 
        q.commune?.nom?.toLowerCase().includes(search)
      );

      this.displayedQuartiers = this.formatDataForTable(filtered);
      this.total = this.displayedQuartiers.length;
      this.lastPage = 1;
      this.page = 1;

      this.cd.detectChanges();
    };

    if (this.allQuartiers.length) {
      return filterResults(this.allQuartiers);
    }

    this.quartierService.getAllQuartiers().subscribe({
      next: (res: any) => {
        const result = res?.result;
        this.allQuartiers = Array.isArray(result) ? result : result ? [result] : [];
        filterResults(this.allQuartiers);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Impossible de charger les données pour la recherche.';
        this.cd.detectChanges();
      },
    });
  }

  // Aplatit l'objet pour extraire le nom de la commune au premier niveau pour CrudPage
  formatDataForTable(items: Quartier[]) {
    return items.map(q => {
      // On cherche la commune correspondante dans la liste préchargée
      const communeTrouvee = this.communesList.find(c => Number(c.id) === Number(q.commune_id));
      
      return {
        ...q,
        // Priorité : 1. L'objet API s'il existe, 2. Le nom trouvé dans la liste, 3. 'Inconnue'
        commune_nom: q.commune?.nom ?? communeTrouvee?.nom ?? 'Inconnue'
      };
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;

    if (this.searchTerm.trim()) {
      this.loadSearchQuartiers(this.searchTerm.trim());
      return;
    }

    this.page = 1;
    this.loadQuartiers();
  }

  onPerPageChange(value: number) {
    this.perPage = value;
    this.page = 1;
    this.loadQuartiers();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadQuartiers();
  }

  openCreate() {
    this.createOpen = true;
  }

  closeCreate() {
    this.createOpen = false;
  }

  onCreateSubmit(dto: CreateQuartierDto) {
    if (this.isCreating) return;

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.quartierService.createQuartier(dto).subscribe({
      next: () => {
        this.successMessage = 'Quartier ajouté avec succès.';
        this.createOpen = false;
        this.isCreating = false;
        this.loadQuartiers();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la création.';
        this.cd.detectChanges();
      },
    });
  }

  openEdit(q: Quartier) {
    this.itemToEdit = q;
    this.editTargetId = Number(q?.id);

    if (!this.editTargetId || this.editTargetId <= 0) {
      this.errorMessage = 'ID quartier invalide';
      return;
    }

    this.editFormData = {
      nom: q.nom,
      commune_id: q.commune_id
    };

    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
    this.editFormData = null;
  }

  onEditSubmit(payload: QuartierEditPayload) {
    this.errorMessage = null;
    this.successMessage = null;

    const { id, data } = payload;

    this.quartierService.updateQuartier(id, data).subscribe({
      next: () => {
        this.successMessage = 'Quartier modifié avec succès.';
        this.editOpen = false;
        this.loadQuartiers();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la modification.';
      },
    });
  }

  openConfirmDelete(q: Quartier) {
    this.confirmtitre = 'Supprimer le quartier';
    this.confirmMessage = `Voulez-vous vraiment supprimer le quartier "${q.nom}" ?`;
    this.confirmButtonLabel = 'Supprimer';
    this.confirmColorClass = 'bg-red-600 hover:bg-red-500';
    this.confirmAction = () => this.performDeleteQuartier(q.id);
    this.confirmOpen = true;
    this.cd.detectChanges();
  }

  cancelConfirm() {
    this.confirmOpen = false;
    this.confirmAction = null;
  }

  performDeleteQuartier(id: number) {
    this.errorMessage = null;
    this.successMessage = null;
    this.confirmOpen = false;
    this.confirmAction = null;

    this.quartierService.deleteQuartier(id).subscribe({
      next: () => {
        this.successMessage = 'Quartier supprimé avec succès.';
        this.loadQuartiers();
      },
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Suppression impossible.'),
    });
  }
}
