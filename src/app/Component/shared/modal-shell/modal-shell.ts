import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-shell',
  imports: [CommonModule],
  templateUrl: './modal-shell.html',
  styleUrl: './modal-shell.css',
})
export class ModalShell {
  @Input() open = false;
  @Input() title = '';

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
