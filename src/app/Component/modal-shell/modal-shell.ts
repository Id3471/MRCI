import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-shell',
  imports: [CommonModule],
  templateUrl: './modal-shell.html',
})
export class ModalShell {
  @Input() open = false;
  @Input() title = '';
  @Input() loading = false;

  @Output() close = new EventEmitter<void>();
}

