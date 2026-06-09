import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateQuartierDto } from '../../../core/models/quartier.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Commune } from '../../../core/models/commune.model';

@Component({
  selector: 'app-create-quartier',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-quartier.html',
  styleUrl: './create-quartier.css',
})
export class CreateQuartier {
  @Input() loading = false;
  @Input() communes: Commune[] = []; // Reçoit la liste des communes depuis le parent
  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateQuartierDto>();

  formValue: Partial<CreateQuartierDto> = {
    nom: '',
    commune_id: undefined
  };
  formSubmitting = false;

  resetForm() {
    this.formValue = { nom: '', commune_id: undefined };
    this.formSubmitting = false;
  }

  onSubmit() {
    if (!this.formValue.nom || !this.formValue.commune_id) return;
    this.formSubmitting = true;
    this.create.emit(this.formValue as CreateQuartierDto);
  }
}
