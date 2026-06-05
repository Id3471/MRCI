import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateResidenceDto } from '../../../core/models/residence.model';
@Component({
  selector: 'app-residence-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './residence-create-modal.html',
})
export class ResidenceCreateModalComponent {
  @Input() open = false;
  @Input() loading = false;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateResidenceDto>();
  formValue: CreateResidenceDto = {
    denomination: '',
    contact: '',
    email: '',
    manager: '',
    logo: undefined,
  };
  formSubmitting = false;
  resetForm() {
    this.formValue = { denomination: '', contact: '', email: '', manager: '', logo: undefined };
  }
  onLogoPicked(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    this.formValue.logo = file;
  }
  onSubmit() {
    this.formSubmitting = true;
    this.create.emit(this.formValue);
  }
}
