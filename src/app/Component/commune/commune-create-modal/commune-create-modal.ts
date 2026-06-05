import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateCommuneDTO } from '../../../core/models/commune.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commune-create-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './commune-create-modal.html',
  styleUrl: './commune-create-modal.css',
})
export class CommuneCreateModal {
  @Input() open = false;
  @Input() loading = false;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateCommuneDTO>();

  formValue: CreateCommuneDTO = {
    libelle: ''
  }
    formSubmitting = false;
    onSubmit() {
    this.formSubmitting = true;
    this.create.emit(this.formValue);
  }
}
