import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CreateQuartierDto, Quartier } from '../../../core/models/quartier.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Commune } from '../../../core/models/commune.model';

export type QuartierEditPayload = { id: number; data: Partial<CreateQuartierDto> };

@Component({
  selector: 'app-update-quartier',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-quartier.html',
  styleUrl: './update-quartier.css',
})
export class UpdateQuartier {
  @Input() targetId = 0;
  @Input() communes: Commune[] = [];
  @Input() initialValue: Partial<CreateQuartierDto> | null = null;
  @Input() quartier!: Quartier;

  @Output() cancel = new EventEmitter<void>();
  @Output() OnSubmit = new EventEmitter<QuartierEditPayload>();

  formValue: Partial<CreateQuartierDto> = {
    nom: '',
    commune_id: undefined
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && this.initialValue) {
      this.formValue = {
        nom: this.initialValue.nom ?? '',
        commune_id: this.initialValue.commune_id ?? undefined
      };
    }
  }
}
