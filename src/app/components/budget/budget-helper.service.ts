import { Injectable } from '@angular/core';
import { Loan_Crop_Practice, Loan_Budget, loan_model } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { preserveWhitespacesDefault } from '@angular/compiler';

@Injectable()
export class BudgetHelperService {
  

  refData: any;
  constructor(private localStorageService : LocalStorageService) {
    this.refData= localStorageService.retrieve(environment.referencedatakey);
   }

  prepareCropPractice(lstCropPractice : Array<Loan_Crop_Practice>){
    let cropList : Array<any>= this.refData.CropList;

    lstCropPractice.map(cp=> {
      let crop = cropList.find(cl=>cl.Crop_And_Practice_ID === cp.Crop_Practice_ID);
      cp.FC_CropName = crop.Crop_Name;
      cp.FC_PracticeType = crop.Practice_type_code;
      return cp;
    })
    return lstCropPractice;
  }

  prepareLoanBudget(lstLoanBudget : Array<Loan_Budget>){
    let expenseType : Array<any> = this.refData.BudgetExpenseType;
    lstLoanBudget.map(budget =>{

      //TODO-SANKET update logic of fetching expense name
      budget.FC_Expense_Name = (expenseType[budget.Expense_Type_ID-1] && expenseType[budget.Expense_Type_ID-1].Budget_Expense_Name) || expenseType[0].Budget_Expense_Name;

      return budget;
    })

    return lstLoanBudget;
   
  }
  getLoanBudgetForCropPractice(lstLoanBudget : Array<Loan_Budget>,cropPracticeId : number,acre : number){

      //get only for current crop practice
      lstLoanBudget = lstLoanBudget.filter(budget => budget.Crop_Practice_ID === cropPracticeId);

      //populate expense name
      lstLoanBudget =  this.prepareLoanBudget(lstLoanBudget);

      // //calcualte budget as per the acres
      // lstLoanBudget.map(budget=>this.muplitypePropsWithAcres(budget,acre));

      return lstLoanBudget;
  }

  muplitypePropsWithAcres(budget : Loan_Budget , acres : number){
    
      budget.ARM_Budget_Crop = budget.ARM_Budget_Acre * acres;
      budget.Distributor_Budget_Crop = budget.Distributor_Budget_Acre * acres;
      budget.Third_Party_Budget_Crop = budget.Third_Party_Budget_Acre * acres;
      budget.Total_Budget_Crop_ET = budget.Total_Budget_Acre * acres;
      return budget;
  }

  populateTotalsInCropPractice(cropPractice : Loan_Crop_Practice, loanBuget : Loan_Budget){
    cropPractice.LCP_ARM_Budget = loanBuget.ARM_Budget_Crop;
    cropPractice.LCP_Third_Party_Budget = loanBuget.Third_Party_Budget_Crop;
    cropPractice.LCP_Distributer_Budget = loanBuget.Distributor_Budget_Crop;
    return cropPractice;
  }
  getTotals(lstloanBudget: Array<Loan_Budget>) {
    return [{
      FC_Expense_Name:'Total:',
      ARM_Budget_Acre: lstloanBudget.reduce((a,b)=>a+ parseFloat(b['ARM_Budget_Acre'].toString()),0),
      Third_Party_Budget_Acre: lstloanBudget.reduce((a,b)=>a+ parseFloat(b['Third_Party_Budget_Acre'].toString()),0),
      Distributor_Budget_Acre: lstloanBudget.reduce((a,b)=>a+ parseFloat(b['Distributor_Budget_Acre'].toString()),0),
      Total_Budget_Acre:  lstloanBudget.reduce((a,b)=>a+ parseFloat(b['Total_Budget_Acre'].toString()),0),
      ARM_Budget_Crop: lstloanBudget.reduce((a,b)=>a+ parseFloat(b['ARM_Budget_Crop'].toString()),0),
      Third_Party_Budget_Crop: lstloanBudget.reduce((a,b)=>a+ parseFloat(b['Third_Party_Budget_Crop'].toString()),0),
      Distributor_Budget_Crop: lstloanBudget.reduce((a,b)=>a+ parseFloat(b['Distributor_Budget_Crop'].toString()),0),
      Total_Budget_Crop_ET: lstloanBudget.reduce((a,b)=> a+ parseFloat(b['Total_Budget_Crop_ET'].toString()),0),
    }]
  }
}
