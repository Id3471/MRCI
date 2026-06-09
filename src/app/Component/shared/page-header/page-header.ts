import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl:'./page-header.html'
})
export class PageHeader {
  @Input() currentPage !: string
  readonly subtitle = input<string>('');
}

