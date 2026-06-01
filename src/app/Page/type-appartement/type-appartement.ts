import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TypeAppartement } from '../../core/models/type-appartement.model';
import { TypeAppartementService } from '../../core/services/type-appartement/type-appartement.service';

@Component({
  selector: 'app-type-appartement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './type-appartement.html',
  styleUrl: './type-appartement.css',
})
export class TypeAppartementPage {
  types: TypeAppartement[] = [];
  error: string | null = null;
  loading = false;

  showCreate = false;
  createLibelle = '';

  showEdit = false;
  editTarget: TypeAppartement | null = null;
  editLibelle = '';

  showConfirm = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = '';

  constructor(
    private typeService: TypeAppartementService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.error = null;
    this.typeService.getAllTypes().subscribe({
      next: (res: any) => {
        this.types = res.result ?? res.chambreTypes ?? res.types ?? [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Impossible de charger les types.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  openCreate() {
    this.createLibelle = '';
    this.showCreate = true;
  }
  submitCreate() {
    if (!this.createLibelle.trim()) {
      this.error = 'Le libellé est requis.';
      return;
    }
    this.loading = true;
    this.typeService.createType(this.createLibelle.trim()).subscribe({
      next: () => {
        this.showCreate = false;
        this.loadAll();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Erreur lors de la création.';
        this.loading = false;
      },
    });
  }

  openEdit(t: TypeAppartement) {
    this.editTarget = t;
    this.editLibelle = t.libelle ?? '';
    this.showEdit = true;
  }
  submitEdit() {
    if (!this.editTarget) return;
    if (!this.editLibelle.trim()) {
      this.error = 'Le libellé est requis.';
      return;
    }
    this.loading = true;
    this.typeService.updateType(this.editTarget.id, this.editLibelle.trim()).subscribe({
      next: () => {
        this.showEdit = false;
        this.editTarget = null;
        this.loadAll();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Erreur lors de la modification.';
        this.loading = false;
      },
    });
  }

  confirmToggle(t: TypeAppartement) {
    this.confirmMessage = t.statut ? `Désactiver "${t.libelle}" ?` : `Activer "${t.libelle}" ?`;
    this.confirmAction = () => this.toggleStatut(t);
    this.showConfirm = true;
  }
  toggleStatut(t: TypeAppartement) {
    this.showConfirm = false;
    this.loading = true;
    const obs = t.statut
      ? this.typeService.deactivateType(t.id)
      : this.typeService.activateType(t.id);
    obs.subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        this.error = err?.error?.message ?? 'Action impossible.';
        this.loading = false;
      },
    });
  }

  confirmDelete(t: TypeAppartement) {
    this.confirmMessage = `Supprimer "${t.libelle}" ?`;
    this.confirmAction = () => this.deleteType(t.id);
    this.showConfirm = true;
  }
  deleteType(id: number) {
    this.showConfirm = false;
    this.loading = true;
    this.typeService.deleteType(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        this.error = err?.error?.message ?? 'Suppression impossible.';
        this.loading = false;
      },
    });
  }

  closeConfirm() {
    this.showConfirm = false;
    this.confirmAction = null;
  }
}
