import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'enquiry',
    loadComponent: () => import('./pages/enquiry/enquiry').then((m) => m.Enquiry),
  },
  {
    path: 'details',
    loadComponent: () => import('./components/customer-response/customer-response').then((m) => m.CustomerResponse),
  },
  {
    path: 'new-enquiry',
    loadComponent: () =>
      import('./components/enquiry-form/enquiry-form').then((m) => m.EnquiryForm),
  },
  {
    path: 'enquiries',
    loadComponent: () =>
      import('./pages/admin/enquiry-crud/enquiry-crud').then((m) => m.EnquiryCrud),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/admin/category-crud/category-crud').then((m) => m.CategoryCrud),
  },
  {
    path: 'status',
    loadComponent: () => import('./pages/admin/status-crud/status-crud').then((m) => m.StatusCrud),
  },
  {
    path: 'track-application',
    loadComponent: () =>
      import('./pages/track-application/track-application').then((m) => m.TrackApplication),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
