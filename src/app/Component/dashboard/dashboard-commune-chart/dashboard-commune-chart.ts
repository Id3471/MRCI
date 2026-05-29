import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardCard } from '../dashboard-card/dashboard-card';

interface CommuneData {
  commune: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-dashboard-commune-chart',
  imports: [CommonModule, DashboardCard],
  templateUrl: './dashboard-commune-chart.html',
  styleUrl: './dashboard-commune-chart.css',
})
export class DashboardCommuneChart {
  @Input() data: CommuneData[] = [];

  hoveredIndex = -1;
  readonly colors = ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f97316', '#06b6d4'];

  get segments() {
    const total = this.data?.reduce((sum, item) => sum + (item.count ?? 0), 0) ?? 0;
    let currentAngle = 0;

    return this.data.map((item, index) => {
      const pct = total > 0 ? item.count / total : 0;
      const angle = pct * 360;
      const segment = {
        commune: item.commune,
        count: item.count,
        percent: item.percent,
        color: this.colors[index % this.colors.length],
        startAngle: currentAngle,
        sweepAngle: angle,
      };
      currentAngle += angle;
      return segment;
    });
  }

  get donutBackground(): string {
    const total = this.data?.reduce((s, d) => s + (d.count ?? 0), 0) ?? 0;
    if (!this.data || this.data.length === 0 || total === 0) {
      return 'conic-gradient(#e5e7eb 0% 100%)';
    }

    let cum = 0;
    const stops = this.data.map((d, i) => {
      const pct = (d.count / total) * 100;
      const start = cum;
      cum += pct;
      const end = i === this.data.length - 1 ? 100 : cum;
      const color = this.colors[i % this.colors.length];
      return `${color} ${start}% ${end}%`;
    });

    return `conic-gradient(${stops.join(', ')})`;
  }

  get hoveredCommuneLabel(): string {
    if (this.hoveredIndex >= 0 && this.hoveredIndex < this.data.length) {
      return this.data[this.hoveredIndex].commune;
    }
    return 'Répartition';
  }

  get hoveredCommuneCount(): number | null {
    if (this.hoveredIndex >= 0 && this.hoveredIndex < this.data.length) {
      return this.data[this.hoveredIndex].count;
    }
    return null;
  }

  setHoveredIndex(index: number): void {
    this.hoveredIndex = index;
  }

  clearHoveredIndex(): void {
    this.hoveredIndex = -1;
  }
}
