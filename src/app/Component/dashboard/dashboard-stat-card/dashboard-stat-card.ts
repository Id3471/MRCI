import { Component, Input } from '@angular/core';
import { DashboardCard } from "../dashboard-card/dashboard-card";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-stat-card',
  imports: [DashboardCard, DecimalPipe],
  templateUrl: './dashboard-stat-card.html',
  styleUrl: './dashboard-stat-card.css',
})
export class DashboardStatCard {
  @Input() subtitle = '';
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() suffix = '';
  @Input() helperText = '';
  @Input() badges: { label: string; variant: 'success' | 'danger' }[] = [];
}
