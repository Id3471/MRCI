import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardCard } from '../dashboard-card/dashboard-card';

interface TypologyData {
  type: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-dashboard-typology-chart',
  imports: [CommonModule, DashboardCard],
  templateUrl: './dashboard-typology-chart.html',
  styleUrl: './dashboard-typology-chart.css',
})
export class DashboardTypologyChart {
  @Input() data: TypologyData[] = [];
}
