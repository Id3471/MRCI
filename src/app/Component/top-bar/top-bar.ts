import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  menuOpen = false;

  @ViewChild('menuRef') menuRef!: ElementRef;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.menuRef && !this.menuRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  logout() {
    console.log('Déconnexion...');
    this.menuOpen = false;
  }
}
