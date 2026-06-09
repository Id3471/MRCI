import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateCommuneDto } from '../../../core/models/commune.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commune-create-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './commune-create-modal.html',
  styleUrl: './commune-create-modal.css',
})
export class CommuneCreateModal {
  @Input() loading = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateCommuneDto>();

  formValue: CreateCommuneDto = {
    nom: '',
  };
  formSubmitting = false;

  resetForm() {
    this.formValue = { nom: '' };
    this.formSubmitting = false;
  }

  onSubmit() {
    if (!this.formValue.nom) return;
    this.formSubmitting = true;
    this.create.emit(this.formValue);
  }
}
