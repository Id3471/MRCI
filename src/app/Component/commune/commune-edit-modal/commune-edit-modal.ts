import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Commune, CreateCommuneDto } from '../../../core/models/commune.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type CommuneEditPayload = { id: number; data: Partial<CreateCommuneDto> };

@Component({
  selector: 'app-commune-edit-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './commune-edit-modal.html',
  styleUrl: './commune-edit-modal.css',
})
export class CommuneEditModal {
  @Input() targetId = 0;
  @Input() initialValue: Partial<CreateCommuneDto> | null = null;
  @Input() commune!: Commune;

  @Output() cancel = new EventEmitter<void>();
  @Output() OnSubmit = new EventEmitter<CommuneEditPayload>();

  formValue: Partial<CreateCommuneDto> = {
    nom: '',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && this.initialValue) {
      this.formValue = {
        nom: this.initialValue.nom ?? '',
      };
    }
  }
}
