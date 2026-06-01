declare const L: any;

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Residence } from '../../core/models/residence.model';

@Component({
  selector: 'app-cartographie-map',
  imports: [CommonModule],
  templateUrl: './cartographie-map.component.html',
  styleUrl: './cartographie-map.component.css',
})
export class CartographieMapComponent implements AfterViewInit, OnChanges {
  @Input() residences: Residence[] = [];
  @Output() selectedResidence = new EventEmitter<Residence>();

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;
  map: any;
  markerLayer: any;
  baseMaps: Record<string, any> = {};

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && changes['residences']) {
      this.renderMarkers();
    }
  }

  private initMap() {
    const defaultCenter = [5.3893476, -4.0494961];

    this.map = new L.Map(this.mapContainer.nativeElement, {
      center: defaultCenter,
      zoom: 12,
      scrollWheelZoom: true,
    });

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    });

    const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });

    osm.addTo(this.map);
    this.baseMaps = {
      'OpenStreetMap': osm,
      'Google Satellite': googleSatellite,
    };

    L.control.layers(this.baseMaps).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.renderMarkers();
  }

  private renderMarkers() {
    this.markerLayer.clearLayers();

    const markers = this.residences
      .map((residence) => {
        const coords = this.getCoordinates(residence);
        if (!coords) {
          return null;
        }

        const marker = L.marker(coords).addTo(this.markerLayer);
        marker.bindPopup(this.createPopupHtml(residence));
        marker.on('click', () => {
          this.selectedResidence.emit(residence);
        });
        return marker;
      })
      .filter((marker) => marker != null);

    if (markers.length) {
      const group = L.featureGroup(markers as any[]);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  private getCoordinates(residence: Residence): [number, number] | null {
    const latitude = this.parseCoordinate(residence.latitude ?? (residence as any).lat);
    const longitude = this.parseCoordinate(residence.longitude ?? (residence as any).lng ?? (residence as any).long);

    if (latitude == null || longitude == null) {
      return null;
    }
    return [latitude, longitude];
  }

  private parseCoordinate(value: number | string | undefined): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  private createPopupHtml(residence: Residence) {
    const commune = typeof residence.commune === 'object'
      ? residence.commune.libelle
      : residence.commune ?? 'N/A';
    const quartier = typeof residence.quartier === 'object'
      ? residence.quartier.libelle
      : residence.quartier ?? 'N/A';

    return `
      <div style="font-size:0.95rem; line-height:1.4; min-width:190px;">
        <div style="font-weight:700; margin-bottom:.35rem;">${residence.nom ?? 'Résidence'}</div>
        <div><strong>Commune :</strong> ${commune}</div>
        <div><strong>Quartier :</strong> ${quartier}</div>
        <div><strong>Contact :</strong> ${residence.contact ?? 'N/A'}</div>
        <div><strong>Email :</strong> ${residence.email ?? 'N/A'}</div>
        <div><strong>Statut :</strong> ${residence.statut ? 'Actif' : 'Inactif'}</div>
      </div>
    `;
  }
}
