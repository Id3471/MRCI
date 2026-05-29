import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBar } from './Component/top-bar/top-bar';
import { SideBar } from './Component/side-bar/side-bar';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBar, SideBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public sidebarService: SidebarService) {}
  protected readonly title = signal('MrciAdminPage');
}
