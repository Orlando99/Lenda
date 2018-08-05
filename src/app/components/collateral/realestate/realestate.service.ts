import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';

/**
 * Shared service for Real estate
 */
@Injectable()
export class RealEstateService {
  constructor() {
  }

  computeTotal(input) {
    var total = []
    var footer = new Loan_Collateral();
    footer.Collateral_Category_Code = 'Total';
    footer.Market_Value = input.LoanMaster[0].FC_Market_Value_realstate;
    footer.Prior_Lien_Amount = input.LoanMaster[0].FC_realstate_Prior_Lien_Amount;
    footer.Lien_Holder = '';
    footer.Net_Market_Value = input.LoanMaster[0].Net_Market_Value_Real_Estate;
    footer.Disc_Value = 0;
    footer.Disc_CEI_Value = input.LoanMaster[0].Disc_value_Real_Estate;
    footer.Qty = input.LoanMaster[0].FC_total_Qty_Real_Estate;
    total.push(footer);
    return total;
  }
}
