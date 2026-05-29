import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardCard } from '../dashboard-card/dashboard-card';

interface EvolutionData {
  label: string;
  value: number;
  height: number;
}

@Component({
  selector: 'app-dashboard-evolution-chart',
  imports: [CommonModule, DashboardCard],
  templateUrl: './dashboard-evolution-chart.html',
  styleUrl: './dashboard-evolution-chart.css',
})
export class DashboardEvolutionChart {
  @Input() data: EvolutionData[] = [];
}
