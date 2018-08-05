import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';

/**
 * Shared service for Stored Crop
 */
@Injectable()
export class StoredCropService {
  constructor() {
  }

  computeTotal(input) {
    var total = []
    var footer = new Loan_Collateral();
    footer.Collateral_Category_Code = 'Total';
    footer.Market_Value = input.LoanMaster[0].FC_Market_Value_storedcrop
    footer.Prior_Lien_Amount = input.LoanMaster[0].FC_storedcrop_Prior_Lien_Amount;
    footer.Lien_Holder = '';
    footer.Net_Market_Value = input.LoanMaster[0].Net_Market_Value_Stored_Crops
    footer.Disc_Value = 0;
    input.LoanMaster[0].Disc_value_Stored_Crops
    footer.Qty = input.LoanMaster[0].FC_total_Qty_storedcrop
    footer.Price = input.LoanMaster[0].FC_total_Price_storedcrop

    total.push(footer);
    return total;
  }
}
