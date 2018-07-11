import { Injectable } from '@angular/core';
import { Loan_Crop_Practice, Loan_Budget, loan_model } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { preserveWhitespacesDefault } from '@angular/compiler';

@Injectable()
export class BudgetHelperService {


  refData: any;
  constructor(private localStorageService: LocalStorageService) {
    this.refData = localStorageService.retrieve(environment.referencedatakey);
  }

  prepareCropPractice(lstCropPractice: Array<Loan_Crop_Practice>) {
    let cropList: Array<any> = this.refData.CropList;

    lstCropPractice.map(cp => {
      let crop = cropList.find(cl => cl.Crop_And_Practice_ID === cp.Crop_Practice_ID);
      cp.FC_CropName = crop.Crop_Name;
      cp.FC_PracticeType = crop.Practice_type_code;
      return cp;
    })
    return lstCropPractice;
  }

  prepareLoanBudget(lstLoanBudget: Array<Loan_Budget>) {
    let expenseType: Array<any> = this.refData.BudgetExpenseType;
    lstLoanBudget.map(budget => {

      //TODO-SANKET update logic of fetching expense name
      budget.FC_Expense_Name = (expenseType[budget.Expense_Type_ID - 1] && expenseType[budget.Expense_Type_ID - 1].Budget_Expense_Name) || expenseType[0].Budget_Expense_Name;

      return budget;
    })

    return lstLoanBudget;

  }
  getLoanBudgetForCropPractice(lstLoanBudget: Array<Loan_Budget>, cropPracticeId: number, acre: number) {

    //get only for current crop practice
    lstLoanBudget = lstLoanBudget.filter(budget => budget.Crop_Practice_ID === cropPracticeId);

    //populate expense name
    lstLoanBudget = this.prepareLoanBudget(lstLoanBudget);

    // //calcualte budget as per the acres
    // lstLoanBudget.map(budget=>this.muplitypePropsWithAcres(budget,acre));

    return lstLoanBudget;
  }

  multiplyPropsWithAcres(budget: Loan_Budget, acres: number) {
    budget.ARM_Budget_Crop = budget.ARM_Budget_Acre * acres;
    budget.Distributor_Budget_Crop = budget.Distributor_Budget_Acre * acres;
    budget.Third_Party_Budget_Crop = budget.Third_Party_Budget_Acre * acres;
    budget.Total_Budget_Crop_ET = budget.Total_Budget_Acre * acres;
    return budget;
  }

  populateTotalsInCropPractice(cropPractice: Loan_Crop_Practice, lstLoanBuget: Array<Loan_Budget>) {

    let totals = this.getTotals(lstLoanBuget)[0];
    cropPractice.LCP_ARM_Budget = totals.ARM_Budget_Crop;
    cropPractice.LCP_Third_Party_Budget = totals.Third_Party_Budget_Crop;
    cropPractice.LCP_Distributer_Budget = totals.Distributor_Budget_Crop;
    return cropPractice;
  }
  getTotals(lstloanBudget: Array<Loan_Budget>) {
    return [{
      FC_Expense_Name: 'Total:',
      ARM_Budget_Acre: lstloanBudget.reduce((a, b) => a + parseFloat(b['ARM_Budget_Acre'].toString()), 0),
      Third_Party_Budget_Acre: lstloanBudget.reduce((a, b) => a + parseFloat(b['Third_Party_Budget_Acre'].toString()), 0),
      Distributor_Budget_Acre: lstloanBudget.reduce((a, b) => a + parseFloat(b['Distributor_Budget_Acre'].toString()), 0),
      Total_Budget_Acre: lstloanBudget.reduce((a, b) => a + (b['Total_Budget_Acre'] ? parseFloat(b['Total_Budget_Acre'].toString()) : 0), 0),
      ARM_Budget_Crop: lstloanBudget.reduce((a, b) => a + (b['ARM_Budget_Crop'] ? parseFloat(b['ARM_Budget_Crop'].toString()) : 0), 0),
      Third_Party_Budget_Crop: lstloanBudget.reduce((a, b) => a + (b['Third_Party_Budget_Crop'] ? parseFloat(b['Third_Party_Budget_Crop'].toString()) : 0), 0),
      Distributor_Budget_Crop: lstloanBudget.reduce((a, b) => a + (b['Distributor_Budget_Crop'] ? parseFloat(b['Distributor_Budget_Crop'].toString()) : 0), 0),
      Total_Budget_Crop_ET: lstloanBudget.reduce((a, b) => a + (b['Total_Budget_Crop_ET'] ? parseFloat(b['Total_Budget_Crop_ET'].toString()) : 0), 0),
    }]
  }

  getTotalTableData(lstLoanBudget: Array<Loan_Budget>, cropPractices: Array<Loan_Crop_Practice>) {
    let loanExpenseTypes: Array<number> = [];
    lstLoanBudget.map(budget => {
      loanExpenseTypes.push(budget.Expense_Type_ID);
    });

    loanExpenseTypes = Array.from(new Set(loanExpenseTypes));

    let totalTableData: Array<Loan_Budget> = [];


    loanExpenseTypes.map(expenseId => {

      let budgetForExpense = new Loan_Budget();
      budgetForExpense.Expense_Type_ID = expenseId;
      budgetForExpense.ARM_Budget_Crop = 0
      budgetForExpense.Distributor_Budget_Crop = 0
      budgetForExpense.Third_Party_Budget_Crop = 0
      budgetForExpense.Total_Budget_Crop_ET = 0

      cropPractices.map(cp => {

        let budget = lstLoanBudget.find(budget => budget.Crop_Practice_ID === cp.Crop_Practice_ID && budget.Expense_Type_ID === expenseId);
        if (budget) {
          budgetForExpense.ARM_Budget_Acre += budget.ARM_Budget_Acre ? parseFloat(budget.ARM_Budget_Acre.toString()) : 0;
          budgetForExpense.Distributor_Budget_Acre += budget.Distributor_Budget_Acre ? parseFloat(budget.Distributor_Budget_Acre.toString()) : 0;
          budgetForExpense.Third_Party_Budget_Acre += budget.Third_Party_Budget_Acre ? parseFloat(budget.Third_Party_Budget_Acre.toString()) : 0;
          budgetForExpense.Total_Budget_Acre = (budgetForExpense.ARM_Budget_Acre + budgetForExpense.Distributor_Budget_Acre + budgetForExpense.Third_Party_Budget_Acre)// budget.Total_Budget_Acre ? parseFloat(budget.Total_Budget_Acre.toString()): 0;

          budgetForExpense.ARM_Budget_Crop += budget.ARM_Budget_Crop ? parseFloat(budget.ARM_Budget_Crop.toString()) : 0;
          budgetForExpense.Distributor_Budget_Crop += budget.Distributor_Budget_Crop ? parseFloat(budget.Distributor_Budget_Crop.toString()) : 0;
          budgetForExpense.Third_Party_Budget_Crop += budget.Third_Party_Budget_Crop ? parseFloat(budget.Third_Party_Budget_Crop.toString()) : 0;
          budgetForExpense.Total_Budget_Crop_ET = (budgetForExpense.ARM_Budget_Crop + budgetForExpense.Distributor_Budget_Crop + budgetForExpense.Third_Party_Budget_Crop)// budget.Total_Budget_Acre ? parseFloat(budget.Total_Budget_Acre.toString()): 0;
        } else {
          console.log(`cp : ${cp.Crop_Practice_ID} and exp ${expenseId}`);
        }
      });

      totalTableData.push(budgetForExpense);
    });
    totalTableData = this.prepareLoanBudget(totalTableData);
    return totalTableData;

  }

  // caculateTotalsBeforeStore(localLoanObject: loan_model) {
  //   //TODO-SANKET remove below line, once the api data is up to date

  //   localLoanObject.LoanBudget.map(budget => {

  //     budget.Total_Budget_Acre = parseFloat(budget.ARM_Budget_Acre.toString()) + parseFloat(budget.Distributor_Budget_Acre.toString()) + parseFloat(budget.Third_Party_Budget_Acre.toString());
  //     return budget;
  //   });

  //   localLoanObject.LoanCropPractices.map(cp => {
  //     //localLoanObject.LoanBudget.map(budget => this.multiplyPropsWithAcres(budget, cp.LCP_Acres))
  //     let acres = cp.LCP_Acres;
  //     let lstLoanBudget :Array<Loan_Budget>=[];
  //     for(let i = 0; i<localLoanObject.LoanBudget.length;i++){
  //       let budget = {...localLoanObject.LoanBudget[i] };
  //       budget.ARM_Budget_Crop = localLoanObject.LoanBudget[i].ARM_Budget_Acre * acres;
  //       budget.Distributor_Budget_Crop = localLoanObject.LoanBudget[i].Distributor_Budget_Acre * acres;
  //       budget.Third_Party_Budget_Crop = localLoanObject.LoanBudget[i].Third_Party_Budget_Acre * acres;
  //       budget.Total_Budget_Crop_ET = localLoanObject.LoanBudget[i].Total_Budget_Acre * acres;
  //       lstLoanBudget.push(budget);
  //     }
  //     localLoanObject.LoanBudget = lstLoanBudget;
  //   })

  //   return localLoanObject;
  //   //REMOVE END
  // }

}
