import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Commune } from '../../core/models/commune.model';
import { CommuneService } from '../../core/services/commune/commune.service';

@Component({
  selector: 'app-commune',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commune.html',
  styleUrl: './commune.css',
})
export class CommunePage {
  communes: Commune[] = [];
  error: string | null = null;
  loading = false;

  // create/edit
  showCreate = false;
  createNom = '';

  showEdit = false;
  editTarget: Commune | null = null;
  editNom = '';

  // confirm
  showConfirm = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = '';

  constructor(private communeService: CommuneService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.error = null;
    this.communeService.getAllCommunes().subscribe({
      next: (res: any) => {
        this.communes = res.result ?? res.communes ?? [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? err?.message ?? 'Impossible de charger les communes.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  openCreate() {
    this.createNom = '';
    this.showCreate = true;
  }

  submitCreate() {
    if (!this.createNom.trim()) { this.error = 'Le libellé est requis.'; return; }
    this.loading = true;
    this.communeService.createCommune(this.createNom.trim()).subscribe({
      next: () => { this.showCreate = false; this.loadAll(); },
      error: (err) => { this.error = err?.error?.message ?? 'Erreur lors de la création.'; this.loading = false; }
    });
  }

  openEdit(c: Commune) {
    this.editTarget = c; this.editNom = c.nom ?? '';
    this.showEdit = true;
  }

  submitEdit() {
    if (!this.editTarget) return;
    if (!this.editNom.trim()) { this.error = 'Le nom est requis.'; return; }
    this.loading = true;
    this.communeService.updateCommune(this.editTarget.id, this.editNom.trim()).subscribe({
      next: () => { this.showEdit = false; this.editTarget = null; this.loadAll(); },
      error: (err) => { this.error = err?.error?.message ?? 'Erreur lors de la modification.'; this.loading = false; }
    });
  }

  confirmToggle(c: Commune) {
    this.confirmMessage = c.statut ? `Désactiver "${c.nom}" ?` : `Activer "${c.nom}" ?`;
    this.confirmAction = () => this.toggleStatut(c);
    this.showConfirm = true;
  }

  toggleStatut(c: Commune) {
    this.showConfirm = false; this.loading = true;
    const obs = c.statut ? this.communeService.deactivateCommune(c.id) : this.communeService.activateCommune(c.id);
    obs.subscribe({ next: () => this.loadAll(), error: (err) => { this.error = err?.error?.message ?? 'Action impossible.'; this.loading = false; } });
  }

  confirmDelete(c: Commune) {
    this.confirmMessage = `Supprimer "${c.nom}" ?`;
    this.confirmAction = () => this.deleteCommune(c.id);
    this.showConfirm = true;
  }

  deleteCommune(id: number) {
    this.showConfirm = false; this.loading = true;
    this.communeService.deleteCommune(id).subscribe({ next: () => this.loadAll(), error: (err) => { this.error = err?.error?.message ?? 'Suppression impossible.'; this.loading = false; } });
  }

  closeConfirm() { this.showConfirm = false; this.confirmAction = null; }
}
