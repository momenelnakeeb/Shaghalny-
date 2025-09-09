import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { jobDetailsResolver } from './job-details-resolver';

describe('jobDetailsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => jobDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
