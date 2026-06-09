import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateProfilDto } from '../../../core/models/profil.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-profil',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-profil.html',
  styleUrl: './create-profil.css',
})
export class CreateProfil {
  @Input() loading = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateProfilDto>();

  formValue: CreateProfilDto = {
    profil_name: '',
    description: ''
  };
  formSubmitting = false;

  resetForm() {
    this.formValue = { profil_name: '', description: '' };
    this.formSubmitting = false;
  }

  onSubmit() {
    if (!this.formValue.profil_name) return;
    this.formSubmitting = true;
    this.create.emit(this.formValue);
  }
}
