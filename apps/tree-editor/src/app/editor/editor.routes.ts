import { Routes } from '@angular/router';

export const EDITOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/editor/editor.component').then(
        (m) => m.EditorComponent
      ),
  },
];
