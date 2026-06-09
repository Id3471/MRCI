import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-generic-modal',
  imports: [CommonModule],
  templateUrl: './generic-modal.html',
  styleUrl: './generic-modal.css',
})
export class GenericModal {
  @Input() open = false;
  @Input() titre = 'Modale';
  @Input() maxWidthClass = 'max-w-2xl';
  @Output() close = new EventEmitter<void>();
}
