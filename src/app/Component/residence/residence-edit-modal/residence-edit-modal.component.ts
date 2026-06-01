import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateResidenceDto, Residence } from '../../../core/models/residence.model';

export type ResidenceEditPayload = {
  id: number;
  data: Partial<CreateResidenceDto>;
};

@Component({
  selector: 'app-residence-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-2xl">
        <div class="relative rounded-2xl bg-white shadow-xl">
          <div class="flex items-center justify-center relative px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">Modification de la résidence</h3>

            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              (click)="close.emit()"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <form
            (ngSubmit)="submit.emit({ id: targetId, data: formValue })"
            enctype="multipart/form-data"
            class="px-6 py-5"
          >
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900">
                  Dénomination <span class="text-red-500">*</span>
                </label>
                <input
                  [(ngModel)]="formValue.denomination"
                  name="denomination"
                  required
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-red-200 focus:ring-4 focus:ring-red-100"
                  placeholder="Nom"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-900">
                    Contact <span class="text-red-500">*</span>
                  </label>
                  <input
                    [(ngModel)]="formValue.contact"
                    name="contact"
                    required
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-red-200 focus:ring-4 focus:ring-red-100"
                    placeholder="Contact"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-900">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    [(ngModel)]="formValue.email"
                    name="email"
                    type="email"
                    required
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-red-200 focus:ring-4 focus:ring-red-100"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-900">
                    Nom du Gérant <span class="text-red-500">*</span>
                  </label>
                  <input
                    [(ngModel)]="formValue.manager"
                    name="manager"
                    required
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-red-200 focus:ring-4 focus:ring-red-100"
                    placeholder="Nom gérant"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-900">Logo</label>
                  <input
                    (change)="onLogoPicked($event)"
                    name="logo"
                    type="file"
                    accept="image/*"
                    class="mt-1 w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-red-600"
                  />
                  <p class="mt-1 text-xs text-gray-500">Optionnel</p>
                </div>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                class="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                (click)="close.emit()"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
              >
                <span class="inline-flex items-center gap-2">✓</span>
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ResidenceEditModalComponent implements OnChanges {
  @Input() open = false;
  @Input() targetId = 0;
  @Input() initialValue: Partial<CreateResidenceDto> | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<ResidenceEditPayload>();

  formValue: Partial<CreateResidenceDto> = {
    denomination: '',
    contact: '',
    email: '',
    manager: '',
    logo: undefined
  };

  ngOnChanges(changes: SimpleChanges) {
    const initialValueChange = changes['initialValue'];
    if (initialValueChange && this.initialValue) {
      this.formValue = {
        denomination: this.initialValue.denomination ?? '',
        contact: this.initialValue.contact ?? '',
        email: this.initialValue.email ?? '',
        manager: this.initialValue.manager ?? '',
        logo: undefined,
      };
    }
  }

  // Utilisé par le parent
  setFromResidence(r: Residence) {
    this.formValue = {
      denomination: r.nom,
      contact: r.contact,
      email: r.email,
      manager: r.manager
    };
  }

  onLogoPicked(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    this.formValue.logo = file;
  }
}

