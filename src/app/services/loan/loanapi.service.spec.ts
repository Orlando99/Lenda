import { TestBed, inject } from '@angular/core/testing';

import { LoanapiService } from './loanapi.service';

describe('LoanapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanapiService]
    });
  });

  it('should be created', inject([LoanapiService], (service: LoanapiService) => {
    expect(service).toBeTruthy();
  }));
});
