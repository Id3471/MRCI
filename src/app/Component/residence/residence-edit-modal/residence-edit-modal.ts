import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateResidenceDto, Residence } from '../../../core/models/residence.model';

export type ResidenceEditPayload = { id: number; data: Partial<CreateResidenceDto> };
@Component({
  selector: 'app-residence-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './residence-edit-modal.html',
})
export class ResidenceEditModalComponent implements OnChanges {
  @Input() targetId = 0;
  @Input() initialValue: Partial<CreateResidenceDto> | null = null;
  @Input() initialLogoUrl: string | null = null;
  @Input() residence!: Residence

  @Output() cancel = new EventEmitter<void>();
  @Output() OnSubmit = new EventEmitter<ResidenceEditPayload>();

  formValue: Partial<CreateResidenceDto> = {
    denomination: '',
    contact: '',
    email: '',
    manager: '',
    logo: undefined,
  };

  logoPreviewUrl: string | null = null;
  private objectUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && this.initialValue) {
      this.formValue = {
        denomination: this.initialValue.denomination ?? '',
        contact: this.initialValue.contact ?? '',
        email: this.initialValue.email ?? '',
        manager: this.initialValue.manager ?? '',
        logo: undefined,
      };

      this.setPreview(this.initialLogoUrl);
    }
  }

  onLogoPicked(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.formValue.logo = file;
    this.setPreview(URL.createObjectURL(file));
  }

  private setPreview(url: string | null) {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    if (url && url.startsWith('blob:')) {
      this.objectUrl = url;
    }

    this.logoPreviewUrl = url;
  }

  ngOnDestroy() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }
}
