import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'jobs', loadComponent: () => import('./jobs/job-list/job-list').then((m) => m.JobList) },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./jobs/job-card/job-card').then((m) => m.JobCard),
  },
  {
    path: 'candidate/apply',
    loadComponent: () =>
      import('./candidate/candidate-form/candidate-form').then((m) => m.CandidateForm),
  },
  {
    path: 'recruiter',
    loadComponent: () =>
      import('./recruiter/recruiter-dashboard/recruiter-dashboard').then(
        (m) => m.RecruiterDashboard
      ),
  },
  { path: 'login', loadComponent: () => import('./auth/login/login').then((m) => m.Login) },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup').then((m) => m.Signup) },
  { path: '**', redirectTo: '' },
];
