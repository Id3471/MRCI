import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CreateTypeAppartementDto, TypeAppartement } from '../../../core/models/type-appartement.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type TypeEditPayload = { id: number; data: Partial<CreateTypeAppartementDto> };

@Component({
  selector: 'app-update-type-apt',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-type-apt.html',
  styleUrl: './update-type-apt.css',
})
export class UpdateTypeApt {
  @Input() targetId = 0;
  @Input() initialValue: Partial<CreateTypeAppartementDto> | null = null;
  @Input() typeAppartement!: TypeAppartement;

  @Output() cancel = new EventEmitter<void>();
  @Output() OnSubmit = new EventEmitter<TypeEditPayload>();

  formValue: Partial<CreateTypeAppartementDto> = {
    libelle: '',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && this.initialValue) {
      this.formValue = {
        libelle: this.initialValue.libelle ?? '',
      };
    }
  }
}
