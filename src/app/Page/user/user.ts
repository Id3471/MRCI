import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateUserDto, User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user/user.service';
import { ProfilService } from '../../core/services/profil/profil.service';
import { ResidenceService } from '../../core/services/residence/residence.service';
import { Profil } from '../../core/models/profil.model';
import { Residence } from '../../core/models/residence.model';
import { API_CONFIG } from '../../core/config/api.config';
import { CrudColumn } from '../../core/models/crud.model';
import { ConfirmModal } from "../../Component/shared/confirm-modal/confirm-modal";
import { GenericModal } from "../../Component/shared/generic-modal/generic-modal";
import { Create } from "../../Component/commodite/create/create";
import { CreateUser } from "../../Component/user/create-user/create-user";
import { UpdateUser, UserEditPayload } from "../../Component/user/update-user/update-user";
import { CrudPage } from "../../Component/shared/crud-page/crud-page";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModal, GenericModal, CreateUser, UpdateUser, CrudPage],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UserPage {
  // Listes de données
  users: User[] = [];
  allUsers: User[] = [];
  displayedUsers: User[] = [];
  profils: Profil[] = [];
  residences: Residence[] = [];
  usertoedit!: User;

  // États de recherche & pagination
  searchTerm = '';
  page = 1;
  perPage = 5;
  total = 0;
  lastPage = 1;

  // États des modaux & loaders
  createOpen = false;
  editOpen = false;
  confirmOpen = false;
  isCreating = false;
  isAssigning = false;
  
  selectedProfilId: number | null = null;
  editTargetId = 0;
  editFormData: Partial<CreateUserDto> | null = null;

  // Gestion des messages de notification
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Configuration dynamique du modal de confirmation
  confirmtitre = '';
  confirmMessage = '';
  confirmButtonLabel = 'Confirmer';
  confirmColorClass = 'bg-red-600 hover:bg-red-500';
  confirmAction: (() => void) | null = null;

  // Colonnes de la table de CRUD
  readonly tableColumns: CrudColumn[] = [
    { key: 'name', label: 'Nom & Prénoms', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'profilLabel', label: 'Profil', type: 'text' },
    { key: 'statut', label: 'Statut', type: 'boolean', trueLabel: 'Actif', falseLabel: 'Inactif' },
  ];

  constructor(
    private userService: UserService,
    private profilService: ProfilService,
    private residenceService: ResidenceService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadInitialData();
  }

  /**
   * Chargement des listes nécessaires aux formulaires (Profils & Résidences)
   */
  loadInitialData() {
    this.profilService.getAllProfils().subscribe({
      next: (res: any) => {
        this.profils = res?.result || [];
        this.cd.detectChanges();
      },
    });

    this.residenceService.getAbsAllResidences().subscribe({
      next: (res: any) => {
        this.residences = res?.result || [];
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Chargement principal des utilisateurs (Paginé ou filtré)
   */
  loadUsers() {
    this.errorMessage = null;
    this.successMessage = null;

    const term = this.searchTerm.trim();
    if (term) {
      return this.loadSearchUsers(term);
    }

    this.userService.getNbUsers(this.perPage, this.page).subscribe({
      next: (res: any) => {
        const result = res?.result;
        const meta = res?.meta;
        const rawUsers = Array.isArray(result) ? result : result ? [result] : [];
        
        // Extraction du libellé du profil pour l'affichage à plat dans le tableau
        this.users = rawUsers.map((u: any) => ({
          ...u,
          profilLabel: u.profil?.libelle ?? 'Inconnue'
        }));

        this.displayedUsers = this.users;
        this.allUsers = [];

        if (meta) {
          this.total = meta.total ?? 0;
          this.lastPage = meta.last_page ?? meta.lastPage ?? 1;
        } else {
          this.total = this.users.length;
          this.lastPage = 1;
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Impossible de charger les utilisateurs.';
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Recherche locale/globale des utilisateurs
   */
  loadSearchUsers(term: string) {
    this.errorMessage = null;

    const filterResults = (items: User[]) => {
      const search = term.toLowerCase();
      this.displayedUsers = items.filter((u) =>
        [u.name, u.email].filter(Boolean).some((val) => val.toLowerCase().includes(search))
      );
      this.total = this.displayedUsers.length;
      this.lastPage = 1;
      this.page = 1;
      this.cd.detectChanges();
    };

    if (this.allUsers.length) {
      return filterResults(this.allUsers);
    }

    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        const result = res?.result;
        const rawUsers = Array.isArray(result) ? result : result ? [result] : [];
        
        this.allUsers = rawUsers.map((u: any) => ({
          ...u,
          profilLabel: u.profil?.libelle ?? 'Inconnue'
        }));

        filterResults(this.allUsers);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la recherche.';
        this.cd.detectChanges();
      },
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    if (this.searchTerm.trim()) {
      this.loadSearchUsers(this.searchTerm.trim());
      return;
    }
    this.page = 1;
    this.loadUsers();
  }

  onPerPageChange(value: number) {
    this.perPage = value;
    this.page = 1;
    this.loadUsers();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadUsers();
  }

  // --- Gestion Création ---
  openCreate() { this.createOpen = true; }
  closeCreate() { this.createOpen = false; }

  onCreateSubmit(dto: CreateUserDto) {
    if (this.isCreating) return;
    this.isCreating = true;

    this.userService.createUser(dto).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur créé avec succès.';
        this.createOpen = false;
        this.isCreating = false;
        this.loadUsers();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage = err?.error?.message ?? "Erreur lors de la création.";
        this.cd.detectChanges();
      },
    });
  }

  // --- Gestion Modification ---
  openEdit(u: User) {
    this.usertoedit = u;
    this.editTargetId = Number(u.id);

    // Initialisation du formulaire enfant via l'input initialValue
    this.editFormData = {
      nom: u.name,
      email: u.email,
      residenceId: u.residence_id
    };
    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
    this.editFormData = null;
  }

  onEditSubmit(payload: UserEditPayload) {
    this.userService.updateUser(payload.id, payload.data).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur mis à jour avec succès.';
        this.editOpen = false;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la modification.';
        this.cd.detectChanges();
      },
    });
  }

  // --- Actions de validation & Statuts ---
  openConfirmToggle(u: User) {
    const isActive = u.statut;
    this.confirmtitre = isActive ? "Désactiver l'utilisateur" : "Activer l'utilisateur";
    this.confirmMessage = `Voulez-vous vraiment ${isActive ? 'désactiver' : 'activer'} l'utilisateur "${u.name}" ?`;
    this.confirmButtonLabel = isActive ? 'Désactiver' : 'Activer';
    this.confirmColorClass = isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500';
    this.confirmAction = () => this.performToggleStatut(u);
    this.confirmOpen = true;
  }

  performToggleStatut(u: User) {
    this.confirmOpen = false;
    const request = u.statut ? this.userService.deactivateUser(u.id) : this.userService.activateUser(u.id);
    
    request.subscribe({
      next: () => this.loadUsers(),
      error: (err) => { this.errorMessage = err?.error?.message ?? 'Changement de statut impossible.'; }
    });
  }

  openConfirmDelete(u: User) {
    this.confirmtitre = "Supprimer l'utilisateur";
    this.confirmMessage = `Voulez-vous vraiment supprimer définitivement l'utilisateur "${u.name}" ?`;
    this.confirmButtonLabel = 'Supprimer';
    this.confirmColorClass = 'bg-red-600 hover:bg-red-500';
    this.confirmAction = () => this.performDeleteUser(u.id);
    this.confirmOpen = true;
  }

  performDeleteUser(id: number) {
    this.confirmOpen = false;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur supprimé avec succès.';
        this.loadUsers();
      },
      error: (err) => { this.errorMessage = err?.error?.message ?? 'Suppression impossible.'; }
    });
  }

  cancelConfirm() {
    this.confirmOpen = false;
    this.confirmAction = null;
  }

  /**
   * Traitement par lot : Assigne le profil sélectionné à tous les utilisateurs actuellement visibles
   */
  onAssignProfile() {
    if (!this.selectedProfilId || this.isAssigning) return;

    const userIds = this.displayedUsers.map(u => u.id);
    if (userIds.length === 0) {
      this.errorMessage = "Aucun utilisateur présent dans la liste pour appliquer l'attribution.";
      return;
    }

    this.isAssigning = true;
    this.userService.assignProfileToUsers(this.selectedProfilId, userIds).subscribe({
      next: () => {
        this.successMessage = 'Profil appliqué avec succès à la sélection.';
        this.selectedProfilId = null;
        this.isAssigning = false;
        this.loadUsers();
      },
      error: (err) => {
        this.isAssigning = false;
        this.errorMessage = err?.error?.message ?? "Erreur lors de l'attribution groupée.";
        this.cd.detectChanges();
      }
    });
  }
}
