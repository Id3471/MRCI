import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {
  @Input() open = false;
  @Input() titre = 'Confirmation';
  @Input() message = 'Êtes-vous sûr de vouloir continuer ?';
  @Input() confirmButtonLabel = 'Confirmer';
  @Input() confirmColorClass = 'bg-red-600 hover:bg-red-500';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
