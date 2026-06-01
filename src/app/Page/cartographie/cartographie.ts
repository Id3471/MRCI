import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartographieMapComponent } from '../../Component/cartographie/cartographie-map.component';
import { ResidenceService } from '../../core/services/residence/residence.service';
import { Residence } from '../../core/models/residence.model';

@Component({
  selector: 'app-cartographie',
  imports: [CommonModule, CartographieMapComponent],
  templateUrl: './cartographie.html',
  styleUrl: './cartographie.css',
})
export class Cartographie implements OnInit {
  residences: Residence[] = [];
  selectedResidence: Residence | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private residenceService: ResidenceService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadResidences();
  }

  loadResidences() {
    this.loading = true;
    this.errorMessage = null;

    this.residenceService.getAbsAllResidences().subscribe({
      next: (res: any) => {
        const result = res?.result;
        this.residences = Array.isArray(result) ? result : result ? [result] : [];
        this.selectedResidence = this.residences[0] ?? null;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Impossible de charger les résidences.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  onMarkerSelected(residence: Residence) {
    this.selectedResidence = residence;
  }
}
