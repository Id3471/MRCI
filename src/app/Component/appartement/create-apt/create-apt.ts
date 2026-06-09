import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as L from 'leaflet';

@Component({
  selector: 'app-create-apt',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-apt.html',
  styleUrl: './create-apt.css',
})
export class CreateApt {
  @Input() loading = false;
  
  @Input() types: any[] = [];
  @Input() residences: any[] = [];
  @Input() communes: any[] = [];
  @Input() quartiers: any[] = [];
  @Input() commodites: any[] = [];
  @Input() userresidenceId: number | null = null;

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<FormData>();

  step = 1;
  formSubmitting = false;

  formValue: any = {
    residenceId: '', typeId: '', code: '', nombrePiece: '',
    prix: '', description: '', communeId: '', quartierId: '',
    adresse: '', rue: '', longitude: '', latitude: ''
  };

  selectedCommodites: number[] = [];
  mainImageFile: File | null = null;
  galleryFiles: File[] = [];

  private map!: L.Map;
  private marker!: L.Marker;

  ngOnChanges(changes: SimpleChanges) {
  if (changes['step'] && this.step === 2) {
    // Petit délai pour attendre que le DOM soit rendu par le *ngIf
    setTimeout(() => {
      if (!this.map) {
        this.initMap();
      } else {
        this.map.invalidateSize(); // Force le recalcul de la taille
      }
    }, 100);
  }
}

  private initMap() {
    // Coordonnées par défaut (ex: Abidjan)
    const lat = 5.3600;
    const lng = -4.0083;

    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Écoute du clic sur la carte
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Mise à jour des valeurs du formulaire
      this.formValue.latitude = lat.toString();
      this.formValue.longitude = lng.toString();

      // Gestion du marqueur sur la carte
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });
  }

  onMainImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.mainImageFile = event.target.files[0];
    }
  }

  onGallerySelected(event: any) {
    if (event.target.files.length > 0) {
      this.galleryFiles = Array.from(event.target.files);
    }
  }

  toggleCommodite(id: number) {
    const idx = this.selectedCommodites.indexOf(id);
    if (idx > -1) {
      this.selectedCommodites.splice(idx, 1);
    } else {
      this.selectedCommodites.push(id);
    }
  }

  changeStep(newStep: number) {
  this.step = newStep;
  if (this.step === 2) {
    setTimeout(() => {
      if (!this.map) {
        this.initMap();
      } else {
        this.map.invalidateSize();
      }
    }, 100);
  }
}

  resetForm() {
    this.step = 1;
    this.formSubmitting = false;
    this.selectedCommodites = [];
    this.mainImageFile = null;
    this.galleryFiles = [];
    this.formValue = {
      residenceId: this.userresidenceId || '', typeId: '', code: '', nombrePiece: '',
      prix: '', description: '', communeId: '', quartierId: '',
      adresse: '', rue: '', longitude: '', latitude: ''
    };
  }

  onSubmit() {
    this.formSubmitting = true;
    
    // Construction du FormData pour l'envoi de fichiers + données
    const formData = new FormData();
    
    // Ajout des champs textuels
    Object.keys(this.formValue).forEach(key => {
      if (this.formValue[key]) {
        formData.append(key, this.formValue[key]);
      }
    });

    // Ajout des commodités (tableau)
    this.selectedCommodites.forEach(id => {
      formData.append('commoditeId[]', id.toString());
    });

    // Ajout de l'image principale
    if (this.mainImageFile) {
      formData.append('image', this.mainImageFile);
    }

    // Ajout de la galerie
    this.galleryFiles.forEach(file => {
      formData.append('images[]', file);
    });

    this.create.emit(formData);
  }
}
