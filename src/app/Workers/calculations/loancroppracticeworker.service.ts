import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';

@Injectable()
export class LoancroppracticeworkerService {

  constructor() { }

  performcalculations(input:loan_model){
    // Empty as if now
    return input;
  }

}
