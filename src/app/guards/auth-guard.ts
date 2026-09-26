import { CanActivateFn, Router } from '@angular/router';
import { getLocal } from '../helper/storage';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const admin = getLocal('admin');
  const router = inject(Router);
  if (admin) {
    return true;
  }
  return router.navigate(['/']);
};
