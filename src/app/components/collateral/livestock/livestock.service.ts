import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';

/**
 * Shared service for FSA
 */
@Injectable()
export class LiveStockService {
  constructor() {
  }

  computeTotal(input) {
    var total = []
    var footer = new Loan_Collateral();
    footer.Collateral_Category_Code = 'Total';
    footer.Market_Value = input.LoanMaster[0].FC_Market_Value_lst
    footer.Prior_Lien_Amount = input.LoanMaster[0].FC_Lst_Prior_Lien_Amount
    footer.Lien_Holder = '';
    footer.Net_Market_Value = input.LoanMaster[0].Net_Market_Value_Livestock
    footer.Disc_Value = 0;
    footer.Disc_CEI_Value = input.LoanMaster[0].Disc_value_Livestock
    footer.Qty = input.LoanMaster[0].FC_total_Qty_lst
    footer.Price = input.LoanMaster[0].FC_total_Price_lst
    total.push(footer);
    return total;
  }
}
