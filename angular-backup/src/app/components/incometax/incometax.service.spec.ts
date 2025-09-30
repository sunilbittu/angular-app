import { TestBed } from '@angular/core/testing';

import { IncometaxService } from './incometax.service';

describe('IncometaxService', () => {
  let service: IncometaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncometaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
