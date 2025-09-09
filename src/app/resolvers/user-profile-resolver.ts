import { ResolveFn } from '@angular/router';

export const userProfileResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
