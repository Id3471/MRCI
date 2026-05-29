import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardCard } from '../dashboard-card/dashboard-card';

interface ApartmentRow {
  type: string;
  residence: string;
  quartier: string;
  price: number;
  status: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-dashboard-apartments-table',
  imports: [CommonModule, DashboardCard],
  templateUrl: './dashboard-apartments-table.html',
  styleUrl: './dashboard-apartments-table.css',
})
export class DashboardApartmentsTable {
  @Input() data: ApartmentRow[] = [];
}
