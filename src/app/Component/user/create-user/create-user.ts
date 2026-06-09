import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateUserDto } from '../../../core/models/user.model';
import { Residence } from '../../../core/models/residence.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {
  @Input() loading = false;
  @Input() residences: Residence[] = [];
  
  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateUserDto>();

  formValue: CreateUserDto = {
    nom: '',
    email: '',
    residenceId: null,
  };

  onSubmit() {
    this.create.emit(this.formValue);
    this.resetForm();
  }

  resetForm() {
    this.formValue = { nom: '', email: '', residenceId: null };
  }
}
