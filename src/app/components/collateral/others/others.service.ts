import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';

/**
 * Shared service for Others
 */
@Injectable()
export class OthersService {
  constructor() {
  }

  computeTotal(loanobject) {
    var total = []
    try {
      var footer = new Loan_Collateral();
      footer.Collateral_Category_Code = 'Total';
      footer.Market_Value = loanobject.LoanMaster[0].FC_Market_Value_other
      footer.Prior_Lien_Amount = loanobject.LoanMaster[0].FC_other_Prior_Lien_Amount
      footer.Lien_Holder = '';
      footer.Net_Market_Value = loanobject.LoanMaster[0].Net_Market_Value__Other
      footer.Disc_Value = 0;
      footer.Disc_CEI_Value = loanobject.LoanMaster[0].Disc_value_Other
      total.push(footer);
      return total;
    }
    catch
    {  // Means that Calculations have not Ended
      return total;
    }
  }
}
