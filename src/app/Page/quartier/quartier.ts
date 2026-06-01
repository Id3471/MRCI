import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quartier } from '../../core/models/quartier.model';
import { QuartierService } from '../../core/services/quartier/quartier.service';
import { CommuneService } from '../../core/services/commune/commune.service';
import { Commune } from '../../core/models/commune.model';

@Component({
  selector: 'app-quartier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quartier.html',
  styleUrl: './quartier.css',
})
export class QuartierPage {
  quartiers: Quartier[] = [];
  communes: Commune[] = [];
  error: string | null = null;
  loading = false;

  showCreate = false;
  createNom = '';
  createCommuneId: number | null = null;

  showEdit = false;
  editTarget: Quartier | null = null;
  editNom = '';
  editCommuneId: number | null = null;

  showConfirm = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = '';

  constructor(
    private quartierService: QuartierService,
    private communeService: CommuneService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadCommunes();
  }

  loadAll() {
    this.loading = true;
    this.error = null;
    this.quartierService.getAllQuartiers().subscribe({
      next: (res: any) => {
        this.quartiers = res.result ?? res.quartiers ?? [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Impossible de charger les quartiers.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  loadCommunes() {
    this.communeService.getAllCommunes().subscribe({
      next: (res: any) => (this.communes = res.result ?? res.communes ?? []),
      error: () => {},
    });
  }

  openCreate() {
    this.createNom = '';
    this.createCommuneId = this.communes?.[0]?.id ?? null;
    this.showCreate = true;
  }
  submitCreate() {
    if (!this.createNom.trim() || !this.createCommuneId) {
      this.error = 'Tous les champs sont requis.';
      return;
    }
    this.loading = true;
    this.quartierService
      .createQuartier({ nom: this.createNom.trim(), communeId: this.createCommuneId })
      .subscribe({
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

  openEdit(q: Quartier) {
    this.editTarget = q;
    this.editNom = q.nom ?? '';
    this.editCommuneId = q.commune?.id ?? null;
    this.showEdit = true;
  }
  submitEdit() {
    if (!this.editTarget || !this.editNom.trim() || !this.editCommuneId) {
      this.error = 'Tous les champs sont requis.';
      return;
    }
    this.loading = true;
    this.quartierService
      .updateQuartier(this.editTarget.id, {
        nom: this.editNom.trim(),
        communeId: this.editCommuneId,
      })
      .subscribe({
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

  confirmDelete(q: Quartier) {
    this.confirmMessage = `Supprimer "${q.nom}" ?`;
    this.confirmAction = () => this.deleteQuartier(q.id);
    this.showConfirm = true;
  }
  deleteQuartier(id: number) {
    this.showConfirm = false;
    this.loading = true;
    this.quartierService.deleteQuartier(id).subscribe({
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
