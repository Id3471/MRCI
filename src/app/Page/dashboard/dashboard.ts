import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DashboardStatCard } from '../../Component/dashboard/dashboard-stat-card/dashboard-stat-card';
import { DashboardCommuneChart } from '../../Component/dashboard/dashboard-commune-chart/dashboard-commune-chart';
import { DashboardTypologyChart } from '../../Component/dashboard/dashboard-typology-chart/dashboard-typology-chart';
import { DashboardEvolutionChart } from '../../Component/dashboard/dashboard-evolution-chart/dashboard-evolution-chart';
import { DashboardAmenitiesList } from '../../Component/dashboard/dashboard-amenities-list/dashboard-amenities-list';
import { DashboardApartmentsTable } from '../../Component/dashboard/dashboard-apartments-table/dashboard-apartments-table';
import { DashboardInactiveResidences } from '../../Component/dashboard/dashboard-inactive-residences/dashboard-inactive-residences';
import { ResidenceService } from '../../core/services/residence/residence.service';
import { ChambreService } from '../../core/services/chambre/chambre.service';
import { CommuneService } from '../../core/services/commune/commune.service';
import { CommoditeService } from '../../core/services/commodite/commodite.service';
import { Residence as ApiResidence } from '../../core/models/residence.model';
import { Chambre as ApiChambre } from '../../core/models/chambre.model';
import { Commune } from '../../core/models/commune.model';


interface DashboardResidence {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
  commune: string;
  quartier: string;
  createdAt: string;
}

interface DashboardApartment {
  id: number;
  type: string;
  residence: string;
  quartier: string;
  commune: string;
  price: number;
  status: 'Actif' | 'Inactif';
  createdAt: string;
  amenities: string[];
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    DashboardStatCard,
    DashboardCommuneChart,
    DashboardTypologyChart,
    DashboardEvolutionChart,
    DashboardAmenitiesList,
    DashboardApartmentsTable,
    DashboardInactiveResidences,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  residences: DashboardResidence[] = [];
  apartments: DashboardApartment[] = [];
  communes: Commune[] = [];
  communeById: Record<number, string> = {};
  loading = true;

  commoditeById: Record<number, string> = {};

  constructor(
    private residenceService: ResidenceService,
    private chambreService: ChambreService,
    private communeService: CommuneService,
    private commoditeService: CommoditeService,
    private cd: ChangeDetectorRef
  ) {}


  ngOnInit() {
    forkJoin({
      residenceResponse: this.residenceService.getAbsAllResidences(),
      chambreResponse: this.chambreService.getAllChambres(),
      communeResponse: this.communeService.getAllCommunes(),
      commoditeResponse: this.commoditeService.getAllCommodites(),
    }).subscribe({
      next: ({ residenceResponse, chambreResponse, communeResponse, commoditeResponse }) => {
        console.log('Dashboard API responses', { residenceResponse, chambreResponse, communeResponse, commoditeResponse });
        this.communes = communeResponse.result ?? [];

        this.commoditeById = (commoditeResponse.commodites ?? []).reduce(
          (map: Record<number, string>, c: any) => {
            if (c?.id != null) {
              map[Number(c.id)] = String(c.libelle ?? c.nom ?? c.label ?? `Commodité #${c.id}`);
            }
            return map;
          },
          {}
        );

        this.communeById = this.communes.reduce((map, commune) => {

          if (commune.id != null) {
            map[commune.id] = commune.nom ?? commune.libelle ?? map[commune.id] ?? 'Inconnue';
          }
          return map;
        }, {} as Record<number, string>);

        this.residences = this.mapResidences(residenceResponse.result);
        this.apartments = this.mapChambres(chambreResponse.result);
        console.log('Dashboard mapped data', {
          residences: this.residences,
          apartments: this.apartments,
        });
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données du dashboard', error);
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  get totalResidences(): number {
    return this.residences.length;
  }

  get activeResidencesCount(): number {
    return this.residences.filter((res) => res.status === 'Active').length;
  }

  get inactiveResidencesCount(): number {
    return this.residences.filter((res) => res.status === 'Inactive').length;
  }

  get apartmentsCount(): number {
    return this.apartments.length;
  }

  get averagePriceActive(): number {
    const activePrices = this.apartments
      .filter((ap) => ap.status === 'Actif')
      .map((ap) => Number(ap.price))
      .filter((price) => !Number.isNaN(price));
    return activePrices.length
      ? Math.round(activePrices.reduce((sum, price) => sum + price, 0) / activePrices.length)
      : 0;
  }

  get newRegistrationsCount(): number {
    const now = new Date();
    return [
      ...this.residences.filter((item) => this.isThisMonth(item.createdAt, now)),
      ...this.apartments.filter((item) => this.isThisMonth(item.createdAt, now)),
    ].length;
  }

  get communeDistribution() {
    const counts = this.groupBy(this.apartments, (ap) => ap.commune);
    const total = this.apartments.length;
    return Array.from(counts.entries())
      .map(([commune, count]) => ({
        commune,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  get typologyStats() {
    const counts = this.groupBy(this.apartments, (ap) => ap.type);
    return Array.from(counts.entries())
      .map(([type, count]) => ({
        type,
        count,
        percent: this.apartmentsCount > 0 ? Math.round((count / this.apartmentsCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  get catalogEvolution() {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        label: date.toLocaleString('fr-FR', { month: 'short', year: '2-digit' }),
        key: `${date.getFullYear()}-${date.getMonth()}`,
      };
    });

    const counts = new Map<string, number>();
    months.forEach((month) => counts.set(month.key, 0));
    this.apartments.forEach((ap) => {
      const date = new Date(ap.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    });

    const maxCount = Math.max(...Array.from(counts.values()), 1);

    return months.map((month) => {
      const value = counts.get(month.key) ?? 0;
      return {
        label: month.label,
        value,
        height: Math.max(10, Math.min(100, (value / maxCount) * 100)),
      };
    });
  }

  get topAmenities() {
    const counts = this.apartments.reduce((acc, ap) => {
      ap.amenities.forEach((amenity) => {
        acc.set(amenity, (acc.get(amenity) ?? 0) + 1);
      });
      return acc;
    }, new Map<string, number>());

    const entries = Array.from(counts.entries()).map(([amenity, count]) => ({
      amenity,
      count,
      percent: this.apartmentsCount > 0 ? Math.round((count / this.apartmentsCount) * 100) : 0,
    }));

    return entries.sort((a, b) => b.count - a.count).slice(0, 6);
  }

  get lastApartmentsAdded() {
    return [...this.apartments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  get inactiveResidences() {
    return this.residences.filter((res) => res.status === 'Inactive');
  }

  private mapResidences(result: ApiResidence | ApiResidence[] | undefined): DashboardResidence[] {
    const list = Array.isArray(result) ? result : result ? [result] : [];
    return list.map((residence) => ({
      id: residence.id,
      name: residence.nom ?? residence.code ?? 'Résidence',
      status: residence.statut ? 'Active' : 'Inactive',
      commune:
        residence.commune?.libelle ??
        (residence.commune as any)?.nom ??
        this.communeById[(residence as any).commune_id ?? -1] ??
        'Inconnue',
      quartier:
        residence.quartier?.libelle ??
        (residence.quartier as any)?.nom ??
        'Inconnu',
      createdAt:
        residence.created_at ??
        (residence as any).createdAt ??
        new Date().toISOString(),
    }));
  }

  private mapChambres(result: unknown): DashboardApartment[] {
    const chambres = this.extractChambreList(result);
    return chambres.map((chambre) => ({
      id: chambre.id,
      type:
        typeof chambre.type === 'string'
          ? chambre.type
          : chambre.type?.type ?? 'Autre',
      residence:
        chambre.residence?.nom ??
        (chambre.residence as any)?.code ??
        `Résidence #${chambre.residence?.id ?? 'inconnue'}`,
      quartier:
        (chambre.quartier as any)?.libelle ??
        chambre.quartier?.nom ??
        'Inconnu',
      commune: this.resolveChambreCommuneName(chambre),
      price: Number(chambre.prix) || 0,
      status: chambre.statut ? 'Actif' : 'Inactif',
      createdAt:
        (chambre as any).created_at ??
        (chambre as any).createdAt ??
        new Date().toISOString(),
      amenities: Array.isArray(chambre.commodites)
        ? chambre.commodites
            .map((amenity) => this.getAmenityLabel(amenity))
            .filter((value): value is string => value.length > 0)
        : [],

    }));
  }

  private extractChambreList(result: unknown): ApiChambre[] {
    if (!result) {
      return [];
    }

    if (Array.isArray(result)) {
      return result;
    }

    if (typeof result === 'object' && result !== null) {
      const typed = result as {
        chambre?: ApiChambre | ApiChambre[];
        data?: ApiChambre[];
        result?: ApiChambre[];
      };
      if (Array.isArray(typed.chambre)) {
        return typed.chambre;
      }
      if (typed.chambre) {
        return [typed.chambre];
      }
      if (Array.isArray(typed.data)) {
        return typed.data;
      }
      if (Array.isArray(typed.result)) {
        return typed.result;
      }
    }

    return [result as ApiChambre];
  }

  private resolveChambreCommuneName(chambre: ApiChambre): string {
    const commune = chambre.commune as any;
    if (commune) {
      if (typeof commune === 'string') {
        return commune;
      }
      if (commune.libelle) {
        return commune.libelle;
      }
      if (commune.nom) {
        return commune.nom;
      }
    }

    const residenceCommune = (chambre.residence as any)?.commune;
    if (residenceCommune) {
      if (typeof residenceCommune === 'string') {
        return residenceCommune;
      }
      return residenceCommune.libelle ?? residenceCommune.nom ?? undefined;
    }

    const communeId = (chambre as any).commune_id ?? (chambre.residence as any)?.commune_id;
    if (communeId != null) {
      const name = this.communeById[communeId];
      if (name) {
        return name;
      }
    }

    const residenceId = chambre.residence?.id;
    if (residenceId != null) {
      const residence = this.residences.find((res) => res.id === residenceId);
      if (residence?.commune) {
        return residence.commune;
      }
    }

    return 'Inconnue';
  }

  private getAmenityLabel(amenity: unknown): string {
    if (!amenity) {
      return '';
    }

    // si l'API renvoie un id (number) ou un objet qui contient commodite_id / id
    if (typeof amenity === 'number') {
      return this.commoditeById[amenity] ?? `Commodité #${amenity}`;
    }

    if (typeof amenity === 'string') {
      // parfois l'API peut renvoyer directement le libellé
      if (this.commoditeById[Number(amenity)]) {
        return this.commoditeById[Number(amenity)];
      }
      return amenity;
    }

    if (typeof amenity === 'object') {
      const anyAmenity = amenity as any;

      if (anyAmenity && typeof anyAmenity.libelle === 'string') {
        return anyAmenity.libelle;
      }
      if (anyAmenity && typeof anyAmenity.nom === 'string') {
        return anyAmenity.nom;
      }
      if (anyAmenity && typeof anyAmenity.label === 'string') {
        return anyAmenity.label;
      }

      const id = anyAmenity.id ?? anyAmenity.commodite_id;
      if (id != null) {
        const numericId = Number(id);
        return this.commoditeById[numericId] ?? `Commodité #${numericId}`;
      }
    }

    return String(amenity);
  }


  private isThisMonth(dateString: string, now: Date): boolean {
    const date = new Date(dateString);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  private groupBy<T>(items: T[], keyFn: (item: T) => string) {
    return items.reduce((map, item) => {
      const key = keyFn(item);
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>());
  }
}
