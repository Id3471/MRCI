import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Profil } from '../../core/models/profil.model';
import { ProfilService } from '../../core/services/profil/profil.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilPage {
  profils: Profil[] = [];
  error: string | null = null;
  loading = false;

  showCreate = false;
  createName = '';
  createDescription = '';

  showEdit = false;
  editTarget: Profil | null = null;
  editName = '';
  editDescription = '';

  showConfirm = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = '';

  constructor(
    private profilService: ProfilService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.error = null;
    this.profilService.getAllProfils().subscribe({
      next: (res: any) => {
        this.profils = res.profils ?? res.result ?? [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? err?.message ?? 'Impossible de charger les profils.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  openCreate() {
    this.createName = '';
    this.createDescription = '';
    this.showCreate = true;
  }
  submitCreate() {
    if (!this.createName.trim()) {
      this.error = 'Le nom est requis.';
      return;
    }
    this.loading = true;
    this.profilService
      .createProfil({ libelle: this.createName.trim(), description: this.createDescription.trim() })
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

  openEdit(p: Profil) {
    this.editTarget = p;
    this.editName = p.libelle ?? '';
    this.editDescription = p.description ?? '';
    this.showEdit = true;
  }
  submitEdit() {
    if (!this.editTarget) return;
    if (!this.editName.trim()) {
      this.error = 'Le nom est requis.';
      return;
    }
    this.loading = true;
    this.profilService
      .updateProfil(this.editTarget.id, {
        libelle: this.editName.trim(),
        description: this.editDescription.trim(),
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

  confirmToggle(p: Profil) {
    this.confirmMessage = p.statut ? `Désactiver "${p.libelle}" ?` : `Activer "${p.libelle}" ?`;
    this.confirmAction = () => this.toggleStatut(p);
    this.showConfirm = true;
  }
  toggleStatut(p: Profil) {
    this.showConfirm = false;
    this.loading = true;
    const obs = p.statut
      ? this.profilService.deactivateProfil(p.id)
      : this.profilService.activateProfil(p.id);
    obs.subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        this.error = err?.error?.message ?? 'Action impossible.';
        this.loading = false;
      },
    });
  }

  confirmDelete(p: Profil) {
    this.confirmMessage = `Supprimer "${p.libelle}" ?`;
    this.confirmAction = () => this.deleteProfil(p.id);
    this.showConfirm = true;
  }
  deleteProfil(id: number) {
    this.showConfirm = false;
    this.loading = true;
    this.profilService.deleteProfil(id).subscribe({
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
