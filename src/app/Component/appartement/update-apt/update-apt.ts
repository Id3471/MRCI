import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-update-apt',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-apt.html',
  styleUrl: './update-apt.css',
})
export class UpdateApt {
  @Input() loading = false;

  @Input() apartment: any | null = null;
  @Input() types: any[] = [];
  @Input() residences: any[] = [];
  @Input() communes: any[] = [];
  @Input() quartiers: any[] = [];
  @Input() commodites: any[] = [];
  @Input() userresidenceId: number | null = null;

  @Output() cancel = new EventEmitter<void>();
  @Output() update = new EventEmitter<FormData>();

  step = 1;
  formSubmitting = false;

  apartmentId: number | null = null;

  formValue: any = {
    residenceId: '',
    typeId: '',
    code: '',
    nombrePiece: '',
    prix: '',
    description: '',
    communeId: '',
    quartierId: '',
    adresse: '',
    rue: '',
    longitude: '',
    latitude: '',
  };

  selectedCommodites: number[] = [];
  mainImageFile: File | null = null;
  galleryFiles: File[] = [];

  existingMainImage: string | null = null;
  existingGallery: string[] = [];

  private map!: L.Map;
  private marker!: L.Marker;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apartment'] && this.apartment) {
      this.loadApartment(this.apartment);
    }
  }

  private loadApartment(apartment: any): void {
    this.apartmentId = apartment.id ?? null;

    this.formValue = {
      residenceId: apartment.residenceId ?? apartment.residenceId ?? '',
      typeId: apartment.type_appartement_id ?? apartment.typeId ?? '',
      code: apartment.code ?? '',
      nombrePiece: apartment.nombre_piece ?? apartment.nombrePiece ?? '',
      prix: apartment.prix ?? '',
      description: apartment.description ?? '',
      communeId: apartment.commune_id ?? apartment.communeId ?? '',
      quartierId: apartment.quartier_id ?? apartment.quartierId ?? '',
      adresse: apartment.adresse ?? '',
      rue: apartment.rue ?? '',
      longitude: apartment.longitude ?? '',
      latitude: apartment.latitude ?? '',
    };

    this.selectedCommodites = (apartment.commodites ?? []).map((c: any) =>
      Number(c.id ?? c)
    );

    this.existingMainImage =
      apartment.image_principale ??
      apartment.image ??
      null;

    this.existingGallery = Array.isArray(apartment.images)
      ? apartment.images
      : [];

    this.mainImageFile = null;
    this.galleryFiles = [];
    this.step = 1;

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  changeStep(newStep: number): void {
    this.step = newStep;

    if (this.step === 2) {
      setTimeout(() => {
        if (!this.map) {
          this.initMap();
        } else {
          this.map.invalidateSize();
          this.syncMarkerToForm();
        }
      }, 100);
    }
  }

  private initMap(): void {
    const lat = parseFloat(this.formValue.latitude) || 5.3600;
    const lng = parseFloat(this.formValue.longitude) || -4.0083;

    this.map = L.map('edit-map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.syncMarkerToForm();

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      this.formValue.latitude = lat.toString();
      this.formValue.longitude = lng.toString();

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });
  }

  private syncMarkerToForm(): void {
    const lat = parseFloat(this.formValue.latitude);
    const lng = parseFloat(this.formValue.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const latLng = L.latLng(lat, lng);

      if (this.marker) {
        this.marker.setLatLng(latLng);
      } else if (this.map) {
        this.marker = L.marker(latLng).addTo(this.map);
      }

      this.map.setView(latLng, 13);
    }
  }

  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.mainImageFile = input.files[0];
    }
  }

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.galleryFiles = Array.from(input.files);
    }
  }

  toggleCommodite(id: number): void {
    const idx = this.selectedCommodites.indexOf(id);

    if (idx > -1) {
      this.selectedCommodites.splice(idx, 1);
    } else {
      this.selectedCommodites.push(id);
    }
  }

  onSubmit(): void {
    this.formSubmitting = true;

    const formData = new FormData();

    if (this.apartmentId !== null) {
      formData.append('id', String(this.apartmentId));
      formData.append('_method', 'PUT');
    }

    Object.keys(this.formValue).forEach((key) => {
      const value = this.formValue[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    this.selectedCommodites.forEach((id) => {
      formData.append('commoditeId[]', String(id));
    });

    if (this.mainImageFile) {
      formData.append('image', this.mainImageFile);
    }

    this.galleryFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    this.update.emit(formData);
  }

  resetForm(): void {
    this.step = 1;
    this.formSubmitting = false;
    this.apartmentId = null;
    this.selectedCommodites = [];
    this.mainImageFile = null;
    this.galleryFiles = [];
    this.existingMainImage = null;
    this.existingGallery = [];

    this.formValue = {
      residenceId: this.userresidenceId || '',
      typeId: '',
      code: '',
      nombrePiece: '',
      prix: '',
      description: '',
      communeId: '',
      quartierId: '',
      adresse: '',
      rue: '',
      longitude: '',
      latitude: '',
    };
  }
}
