import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CreateProfilDto, Profil } from '../../../core/models/profil.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ProfilEditPayload = { id: number; data: Partial<CreateProfilDto> };

@Component({
  selector: 'app-update-profil',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profil.html',
  styleUrl: './update-profil.css',
})
export class UpdateProfil {
  @Input() targetId = 0;
  @Input() initialValue: Partial<CreateProfilDto> | null = null;
  @Input() profil!: Profil;

  @Output() cancel = new EventEmitter<void>();
  @Output() OnSubmit = new EventEmitter<ProfilEditPayload>();

  formValue: Partial<CreateProfilDto> = {
    profil_name: '',
    description: ''
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && this.initialValue) {
      this.formValue = {
        profil_name: this.initialValue.profil_name ?? '',
        description: this.initialValue.description ?? ''
      };
    }
  }
}
