import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardCard } from '../dashboard-card/dashboard-card';

interface AmenityData {
  amenity: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-dashboard-amenities-list',
  imports: [CommonModule, DashboardCard],
  templateUrl: './dashboard-amenities-list.html',
  styleUrl: './dashboard-amenities-list.css',
})
export class DashboardAmenitiesList {
  @Input() data: AmenityData[] = [];
}
