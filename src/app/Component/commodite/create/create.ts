import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateCommoditeDto } from '../../../core/models/commodite.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  @Input() loading = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateCommoditeDto>();

  formValue: CreateCommoditeDto = {
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
