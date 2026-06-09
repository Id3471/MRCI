import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartographieMapComponent } from '../../Component/cartographie/cartographie-map.component';
import { ResidenceService } from '../../core/services/residence/residence.service';
import { Residence } from '../../core/models/residence.model';
import { Appartement } from '../../core/models/chambre.model';
import { AppartementService } from '../../core/services/chambre/chambre.service';

@Component({
  selector: 'app-cartographie',
  imports: [CommonModule, CartographieMapComponent],
  templateUrl: './cartographie.html',
  styleUrl: './cartographie.css',
})
export class Cartographie implements OnInit {
  appartements: Appartement[] = [];
  selectedAppartement: Appartement | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private appartementService: AppartementService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAppartements();
  }

  loadAppartements() {
    this.loading = true;
    this.errorMessage = null;

    this.appartementService.getAll().subscribe({
      next: (res: any) => {
        const result = res?.result;
        this.appartements = Array.isArray(result) ? result : result ? [result] : [];
        this.selectedAppartement = this.appartements[0] ?? null;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Impossible de charger les appartements.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  onMarkerSelected(appartement: Appartement) {
    this.selectedAppartement = appartement;
  }
}
