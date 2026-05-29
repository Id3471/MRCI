import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardCard } from '../dashboard-card/dashboard-card';

interface ResidenceData {
  name: string;
  quartier: string;
  commune: string;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard-inactive-residences',
  imports: [CommonModule, DashboardCard],
  templateUrl: './dashboard-inactive-residences.html',
  styleUrl: './dashboard-inactive-residences.css',
})
export class DashboardInactiveResidences {
  @Input() data: ResidenceData[] = [];
}
