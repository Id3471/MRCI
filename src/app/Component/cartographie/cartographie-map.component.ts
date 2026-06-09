declare const L: any;

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Residence } from '../../core/models/residence.model';
import { Appartement } from '../../core/models/chambre.model';

@Component({
  selector: 'app-cartographie-map',
  imports: [CommonModule],
  templateUrl: './cartographie-map.component.html',
  styleUrl: './cartographie-map.component.css',
})
export class CartographieMapComponent implements AfterViewInit, OnChanges {
  @Input() appartements: Appartement[] = [];
  @Output() selectedAppartement = new EventEmitter<Appartement>();

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;
  map: any;
  markerLayer: any;
  baseMaps: Record<string, any> = {};

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && changes['appartements']) {
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

    const markers = this.appartements
      .map((appartement) => {
        const coords = this.getCoordinates(appartement);
        if (!coords) {
          return null;
        }

        const marker = L.marker(coords).addTo(this.markerLayer);
        marker.bindPopup(this.createPopupHtml(appartement));
        marker.on('click', () => {
          this.selectedAppartement.emit(appartement);
        });
        return marker;
      })
      .filter((marker) => marker != null);

    if (markers.length) {
      const group = L.featureGroup(markers as any[]);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  private getCoordinates(appartement: Appartement): [number, number] | null {
    const latitude = this.parseCoordinate(appartement.latitude);
    const longitude = this.parseCoordinate(appartement.longitude);

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

  private createPopupHtml(appartement: Appartement) {
    return `
      <div style="font-size:0.95rem; line-height:1.4; min-width:190px;">
        <div style="font-weight:700; margin-bottom:.35rem;">Appartement: ${appartement.code ?? 'N/A'}</div>
        <div><strong>Prix :</strong> ${appartement.prix ? appartement.prix + ' FCFA' : 'N/A'}</div>
        <div><strong>Pièces :</strong> ${appartement.nombre_piece ?? 'N/A'}</div>
        <div><strong>Adresse :</strong> ${appartement.adresse ?? 'N/A'}</div>
        <div><strong>Statut :</strong> ${appartement.statut ? 'Disponible' : 'Indisponible'}</div>
      </div>
    `;
  }
}
