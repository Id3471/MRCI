import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CreateUserDto, User } from '../../../core/models/user.model';
import { Residence } from '../../../core/models/residence.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type UserEditPayload = { id: number; data: Partial<CreateUserDto> };

@Component({
  selector: 'app-update-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-user.html',
  styleUrl: './update-user.css',
})
export class UpdateUser {
  @Input() targetId = 0;
  @Input() initialValue: Partial<CreateUserDto> | null = null;
  @Input() residences: Residence[] = [];
  @Input() user!: User;

  @Output() cancel = new EventEmitter<void>();
  @Output() OnSubmit = new EventEmitter<UserEditPayload>();

  formValue: Partial<CreateUserDto> = {
    nom: '',
    email: '',
    residenceId: null,
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && this.initialValue) {
      this.formValue = {
        nom: this.initialValue.nom ?? '',
        email: this.initialValue.email ?? '',
        residenceId: this.initialValue.residenceId ?? null,
      };
    }
  }
}
