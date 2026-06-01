import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Commodite } from '../../core/models/commodite.model';
import { CommoditeService } from '../../core/services/commodite/commodite.service';

@Component({
  selector: 'app-commodite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commodite.html',
  styleUrl: './commodite.css',
})
export class CommoditePage {
  commodites: Commodite[] = [];
  error: string | null = null;
  loading = false;

  // create/edit modal state
  showCreate = false;
  createLibelle = '';

  showEdit = false;
  editTarget: Commodite | null = null;
  editLibelle = '';

  // confirmation
  showConfirm = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = '';

  successMessage: string | null = null;

  constructor(
    private commoditeService: CommoditeService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.error = null;
    this.successMessage = null;
    this.commoditeService.getAllCommodites().subscribe({
      next: (res: any) => {
        this.commodites = res.commodites ?? res.result ?? [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? err?.message ?? 'Impossible de charger les commodités.';
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
    this.commoditeService.createCommodite({ libelle: this.createLibelle.trim() }).subscribe({
      next: () => {
        this.successMessage = 'Commodité créée.';
        this.showCreate = false;
        this.loadAll();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Erreur lors de la création.';
        this.loading = false;
      },
    });
  }

  openEdit(c: Commodite) {
    this.editTarget = c;
    this.editLibelle = c.libelle ?? '';
    this.showEdit = true;
  }

  submitEdit() {
    if (!this.editTarget) return;
    if (!this.editLibelle.trim()) {
      this.error = 'Le libellé est requis.';
      return;
    }
    this.loading = true;
    this.commoditeService
      .updateCommodite(this.editTarget.id, { libelle: this.editLibelle.trim() })
      .subscribe({
        next: () => {
          this.successMessage = 'Commodité modifiée.';
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

  confirmToggle(c: Commodite) {
    this.confirmMessage = c.statut ? `Désactiver "${c.libelle}" ?` : `Activer "${c.libelle}" ?`;
    this.confirmAction = () => this.toggleStatut(c);
    this.showConfirm = true;
  }

  toggleStatut(c: Commodite) {
    this.showConfirm = false;
    this.loading = true;
    const obs = c.statut
      ? this.commoditeService.deactivateCommodite(c.id)
      : this.commoditeService.activateCommodite(c.id);
    obs.subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        this.error = err?.error?.message ?? 'Action impossible.';
        this.loading = false;
      },
    });
  }

  confirmDelete(c: Commodite) {
    this.confirmMessage = `Supprimer "${c.libelle}" ?`;
    this.confirmAction = () => this.deleteCommodite(c.id);
    this.showConfirm = true;
  }

  deleteCommodite(id: number) {
    this.showConfirm = false;
    this.loading = true;
    this.commoditeService.deleteCommodite(id).subscribe({
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
