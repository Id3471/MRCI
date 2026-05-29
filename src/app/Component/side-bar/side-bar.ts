import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../sidebar.service';

interface SidebarChild {
  label: string;
  route: string;
  icon: string;
}

interface SidebarItem {
  label: string;
  route?: string;
  icon: string;
  children?: SidebarChild[];
  expanded?: boolean;
}

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  constructor(
    public sidebar: SidebarService,
    private router: Router,
  ) {}

  items: SidebarItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
    },
    {
      label: 'Résidences',
      route: '/residences',
      icon: 'apartment',
    },
    {
      label: 'Cartographie',
      route: '/cartographie',
      icon: 'map',
    },
    {
      label: 'Appartements',
      route: '/appartements',
      icon: 'home',
    },

    {
      label: 'Paramétrage',
      icon: 'settings',
      expanded: true,
      children: [
        { label: 'Commodités', route: '/parametrage/commodites', icon: 'category' },
        { label: 'Type Appartement', route: '/parametrage/types-appartement', icon: 'home_work' },
        { label: 'Commune', route: '/parametrage/communes', icon: 'location_city' },
        { label: 'Quartier', route: '/parametrage/quartiers', icon: 'map' },
      ],
    },

    {
      label: 'Administration',
      icon: 'admin_panel_settings',
      expanded: true,
      children: [
        { label: 'Utilisateurs', route: '/administration/utilisateurs', icon: 'group' },
        { label: 'Profils', route: '/administration/profils', icon: 'badge' },
      ],
    },
  ];

  toggleSidebar(): void {
    this.sidebar.toggle();
  }

  toggleGroup(item: SidebarItem): void {
    if (!item.children) return;
    item.expanded = !item.expanded;
  }

  trackByLabel(_: number, item: SidebarItem | SidebarChild): string {
    return item.label;
  }

  isGroupActive(item: SidebarItem): boolean {
    if (!item.children) return false;
    return item.children.some((child) =>
      this.router.isActive(child.route, {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      }),
    );
  }
}
