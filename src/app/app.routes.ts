import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'store',
    loadComponent: () => import('./pages/store/store').then((m) => m.StoreComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.CartComponent),
  },
  {
    path: 'success',
    loadComponent: () => import('./pages/success/success').then((m) => m.SuccessComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
