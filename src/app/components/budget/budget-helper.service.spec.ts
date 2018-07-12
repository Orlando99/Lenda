import { TestBed, inject } from '@angular/core/testing';

import { BudgetHelperService } from './budget-helper.service';

describe('BudgetHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetHelperService]
    });
  });

  it('should be created', inject([BudgetHelperService], (service: BudgetHelperService) => {
    expect(service).toBeTruthy();
  }));
});
