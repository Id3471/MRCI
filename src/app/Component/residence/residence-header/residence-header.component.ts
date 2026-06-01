import { Component, input } from '@angular/core';

@Component({
  selector: 'app-residence-header',
  imports: [],
  template: `
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.18em] text-gray-500">Gestion</p>
        <h1 class="text-3xl font-semibold text-gray-900">Résidences</h1>
      </div>

      <div class="flex items-center gap-3">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ResidenceHeaderComponent {
  // Future: inputs si besoin (titre, sous-titre)
  readonly subtitle = input<string>('');
}

