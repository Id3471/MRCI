import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Commodite, CreateCommoditeDto } from '../../../core/models/commodite.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type CommoditeEditPayload = { id: number; data: Partial<CreateCommoditeDto> };

@Component({
  selector: 'app-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './update.html',
  styleUrl: './update.css',
})
export class Update implements OnChanges{
  @Input() targetId = 0;
  @Input() initialValue: Partial<CreateCommoditeDto> | null = null;
  @Input() commodite!: Commodite;

  @Output() cancel = new EventEmitter<void>();
  @Output() OnSubmit = new EventEmitter<CommoditeEditPayload>();

  formValue: Partial<CreateCommoditeDto> = {
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
