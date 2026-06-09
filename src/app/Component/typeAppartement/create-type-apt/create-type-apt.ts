import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateTypeAppartementDto } from '../../../core/models/type-appartement.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-type-apt',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-type-apt.html',
  styleUrl: './create-type-apt.css',
})
export class CreateTypeApt {
  @Input() loading = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateTypeAppartementDto>();

  formValue: CreateTypeAppartementDto = {
    libelle: '',
  };
  formSubmitting = false;

  resetForm() {
    this.formValue = { libelle: '' };
    this.formSubmitting = false;
  }

  onSubmit() {
    if (!this.formValue.libelle) return;
    this.formSubmitting = true;
    this.create.emit(this.formValue);
  }
}
