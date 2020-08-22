import { TestBed } from '@angular/core/testing';

import { FightsService } from './fights.service';

describe('FightsService', () => {
  let service: FightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
