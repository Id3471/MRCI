import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CrudActionsConfig, CrudColumn } from '../../../core/models/crud.model';
import { PageHeader } from "../page-header/page-header";

@Component({
  selector: 'app-crud-page',
  imports: [CommonModule, FormsModule, PageHeader],
  templateUrl: './crud-page.html',
  styleUrl: './crud-page.css',
})
export class CrudPage {
  @Input() titre = 'Liste';
  @Input() data: any[] = [];
  @Input() columns: CrudColumn[] = [];
  @Input() actionsConfig: CrudActionsConfig = { canEdit: true, canDelete: true, canToggle: false };
  @Input() searchPlaceholder = 'Rechercher...';

  // Pagination State
  @Input() page = 1;
  @Input() perPage = 5;
  @Input() total = 0;
  @Input() lastPage = 1;

  // Alerts
  @Input() errorMessage: string | null = null;
  @Input() successMessage: string | null = null;

  searchTerm = '';

  @Output() searchChange = new EventEmitter<string>();
  @Output() perPageChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();

  @Output() addClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() toggleClick = new EventEmitter<any>();

  onSearch(term: string) {
    this.searchChange.emit(term);
  }

  changePerPage(value: number) {
    this.perPageChange.emit(value);
  }

  goPrev() {
    if (this.page > 1) this.pageChange.emit(this.page - 1);
  }

  goNext() {
    if (this.page < this.lastPage) this.pageChange.emit(this.page + 1);
  }

  getToggleState(item: any): boolean {
    if (!this.actionsConfig.toggleKey) return false;
    return item[this.actionsConfig.toggleKey] === true;
  }
}
