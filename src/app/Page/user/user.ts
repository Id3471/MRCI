import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user/user.service';
import { ProfilService } from '../../core/services/profil/profil.service';
import { ResidenceService } from '../../core/services/residence/residence.service';
import { Profil } from '../../core/models/profil.model';
import { Residence } from '../../core/models/residence.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UserPage {
  users: User[] = [];
  profils: Profil[] = [];
  residences: Residence[] = [];
  error: string | null = null;
  loading = false;

  showCreate = false;
  createName = '';
  createEmail = '';
  createProfilId: number | null = null;
  createResidenceId: number | null = null;

  showEdit = false;
  editTarget: User | null = null;
  editName = '';
  editEmail = '';
  editProfilId: number | null = null;
  editResidenceId: number | null = null;

  showConfirm = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = '';

  constructor(
    private userService: UserService,
    private profilService: ProfilService,
    private residenceService: ResidenceService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadRefs();
  }

  loadAll() {
    this.loading = true;
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.users ?? res.result ?? [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Impossible de charger les utilisateurs.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  loadRefs() {
    this.profilService.getAllProfils().subscribe({
      next: (res: any) => (this.profils = res.profils ?? res.result ?? []),
      error: () => {},
    });
    this.residenceService.getAllResidences().subscribe({
      next: (res: any) => (this.residences = res.result ?? res.residences ?? []),
      error: () => {},
    });
  }

  openCreate() {
    this.createName = '';
    this.createEmail = '';
    this.createProfilId = this.profils?.[0]?.id ?? null;
    this.createResidenceId = this.residences?.[0]?.id ?? null;
    this.showCreate = true;
  }
  submitCreate() {
    if (!this.createName.trim() || !this.createEmail.trim()) {
      this.error = 'Nom et email requis.';
      return;
    }
    this.loading = true;
    this.userService
      .createUser({
        name: this.createName.trim(),
        email: this.createEmail.trim(),
        residence_id: this.createResidenceId ?? undefined,
        profil_id: this.createProfilId ?? undefined,
      })
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

  openEdit(u: User) {
    this.editTarget = u;
    this.editName = u.name;
    this.editEmail = u.email;
    this.editProfilId = u.profil?.id ?? null;
    this.editResidenceId = u.residence_id ?? null;
    this.showEdit = true;
  }
  submitEdit() {
    if (!this.editTarget) return;
    if (!this.editName.trim() || !this.editEmail.trim()) {
      this.error = 'Nom et email requis.';
      return;
    }
    this.loading = true;
    this.userService
      .updateUser(this.editTarget.id, {
        name: this.editName.trim(),
        email: this.editEmail.trim(),
        residence_id: this.editResidenceId ?? undefined,
        profil_id: this.editProfilId ?? undefined,
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

  confirmToggle(u: User) {
    this.confirmMessage = u.statut ? `Désactiver "${u.name}" ?` : `Activer "${u.name}" ?`;
    this.confirmAction = () => this.toggleStatut(u);
    this.showConfirm = true;
  }
  toggleStatut(u: User) {
    this.showConfirm = false;
    this.loading = true;
    const obs = u.statut
      ? this.userService.deactivateUser(u.id)
      : this.userService.activateUser(u.id);
    obs.subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        this.error = err?.error?.message ?? 'Action impossible.';
        this.loading = false;
      },
    });
  }

  confirmDelete(u: User) {
    this.confirmMessage = `Supprimer "${u.name}" ?`;
    this.confirmAction = () => this.deleteUser(u.id);
    this.showConfirm = true;
  }
  deleteUser(id: number) {
    this.showConfirm = false;
    this.loading = true;
    this.userService.deleteUser(id).subscribe({
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
