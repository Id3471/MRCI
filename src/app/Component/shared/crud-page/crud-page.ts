import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CrudColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-crud-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-page.html',
  styleUrl: './crud-page.css',
})
export class CrudPage {
  @Input() title = '';

  @Input() data: any[] = [];

  @Input() columns: any[] = [];

  @Input() page = 1;

  @Input() lastPage = 1;

  @Input() total = 0;

  @Input() searchTerm = '';

  @Output() create = new EventEmitter<void>();

  @Output() edit = new EventEmitter<any>();

  @Output() delete = new EventEmitter<any>();

  @Output() toggle = new EventEmitter<any>();

  @Output() searchChange = new EventEmitter<string>();

  @Output() prevPage = new EventEmitter<void>();

  @Output() nextPage = new EventEmitter<void>();
}
