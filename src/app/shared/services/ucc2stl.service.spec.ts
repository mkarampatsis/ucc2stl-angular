import { TestBed } from '@angular/core/testing';

import { Ucc2stlService } from './ucc2stl.service';

describe('Ucc2stlService', () => {
  let service: Ucc2stlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ucc2stlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
