import { JsonProperty, JsonObject, JsonConverter, JsonCustomConvert } from "json2typescript";
import { Loan_Crop_Unit, Loan_Crop_Unit_FC, V_Crop_Price_Details, Loan_Crop_History_FC } from "./cropmodel";
import { IntConverter, StringConverter } from "../Workers/utility/jsonconvertors";
import { Loan_Farm } from "./farmmodel.";
import {LoanQResponse} from './loan-response.model';


@JsonObject
export class borrower_model
    {
        @JsonProperty("Loan_PK_ID", IntConverter,false)
        Loan_PK_ID: number=undefined;

        @JsonProperty("Loan_Full_ID", IntConverter,false)
        Loan_Full_ID: number=undefined;

        @JsonProperty("Borrower_ID", IntConverter,false)
        Borrower_ID: number=undefined;

        @JsonProperty("Borrower_ID_Type_Code", IntConverter,false)
        Borrower_ID_Type_Code: number=undefined;

        @JsonProperty("Borrower_SSN_Hash", StringConverter,false)
        Borrower_SSN_Hash: string="";

        @JsonProperty("Borrower_Entity_Type", IntConverter,false)
        Borrower_Entity_Type: number=undefined;

        @JsonProperty("Borrower_Entity_Notes", StringConverter,false)
        Borrower_Entity_Notes: string="";

        @JsonProperty("Borrower_Last_Name", StringConverter,false)
        Borrower_Last_Name: string="";

        @JsonProperty("Borrower_First_Name", StringConverter,false)
        Borrower_First_Name:string="";

        @JsonProperty("Borrower_MI", StringConverter,false)
        Borrower_MI: string="";

        @JsonProperty("Borrower_Address", StringConverter,false)
        Borrower_Address: string="";

        @JsonProperty("Borrower_City", StringConverter,false)
        Borrower_City: string="";

        @JsonProperty("Borrower_State_ID", StringConverter,false)
        Borrower_State_ID: string="";

        @JsonProperty("Borrower_Zip", IntConverter,false)
        Borrower_Zip: number=undefined

        @JsonProperty("Borrower_Phone", StringConverter,false)
        Borrower_Phone: string="";

        @JsonProperty("Borrower_Email", StringConverter,false)
        Borrower_Email: string="";

        @JsonProperty("Borrower_Preferred_Contact_ind", IntConverter,false)
        Borrower_Preferred_Contact_ind: number=undefined;

        @JsonProperty("Borrower_DL_State", StringConverter,false)
        Borrower_DL_State: string="";

        @JsonProperty("Borrower_DL_Num", IntConverter,false)
        Borrower_DL_Num: number=undefined

        @JsonProperty("Borrower_DOB", StringConverter,false)
        Borrower_DOB:string="";

        @JsonProperty("Borrower_County", IntConverter,false)
        Borrower_County: number=undefined;

        @JsonProperty("Borrower_Lat", IntConverter,false)
        Borrower_Lat: number=undefined;

        @JsonProperty("Borrower_Long", IntConverter,false)
        Borrower_Long: number=undefined;

        @JsonProperty("Borrower_Farmer_ID", IntConverter,false)
        Borrower_Farmer_ID: number=undefined;

        @JsonProperty("Borrower_3yr_Tax_Returns", IntConverter,false)
        Borrower_3yr_Tax_Returns: number=undefined;

        @JsonProperty("Borrower_Banruptcy_status", IntConverter,false)
        Borrower_Banruptcy_status: number=undefined;

        @JsonProperty("Borrower_Judgement_Ind", IntConverter,false)
        Borrower_Judgement_Ind: number=undefined;

        @JsonProperty("Borrower_CPA_financials", IntConverter,false)
        Borrower_CPA_financials: number=undefined;

        @JsonProperty("Borrower_Credit_Score", IntConverter,false)
        Borrower_Credit_Score: number=undefined;

        @JsonProperty("Borrower_Credit_score_date", StringConverter,false)
        Borrower_Credit_score_date:  string ="";

        @JsonProperty("Borrower_Financials_Date", StringConverter,false)
        Borrower_Financials_Date:  string ="";

        @JsonProperty("Borrower_Current_Assets", IntConverter,false)
        Borrower_Current_Assets: number=undefined;

        @JsonProperty("Borrower_Current_Assets_Disc", IntConverter,false)
        Borrower_Current_Assets_Disc: number=undefined;

        @JsonProperty("Borrower_Intermediate_Assets", IntConverter,false)
        Borrower_Intermediate_Assets: number=undefined;

        @JsonProperty("Borrower_Intermediate_Assets_Disc", IntConverter,false)
        Borrower_Intermediate_Assets_Disc: number=undefined;

        @JsonProperty("Borrower_Fixed_Assets", IntConverter,false)
        Borrower_Fixed_Assets: number=undefined;

        @JsonProperty("Borrower_Fixed_Assets_Disc", IntConverter,false)
        Borrower_Fixed_Assets_Disc: number=undefined;

        @JsonProperty("Borrower_Fixed_Liabilities", IntConverter,false)
        Borrower_Fixed_Liabilities: number=undefined;

        @JsonProperty("Borrower_Intermediate_Liabilities", IntConverter,false)
        Borrower_Intermediate_Liabilities: number=undefined;

        @JsonProperty("Borrower_Current_Liabilities", IntConverter,false)
        Borrower_Current_Liabilities: number=undefined;

        @JsonProperty("Borrower_Rating", IntConverter,false)
        Borrower_Rating: number=undefined;

        @JsonProperty("Borrower_Income_detail_Ind", IntConverter,false)
        Borrower_Income_detail_Ind: number=undefined;

        @JsonProperty("Spouse_SSN_Hash", IntConverter,false)
        Spouse_SSN_Hash: number=undefined;

        @JsonProperty("Spouse_Last_Name", StringConverter,false)
        Spouse_Last_Name: string="";

        @JsonProperty("Spouse_First_Name", StringConverter,false)
        Spouse_First_Name: string="";

        @JsonProperty("Spouse_MI", StringConverter,false)
        Spouse_MI: string="";

        @JsonProperty("Spouse_Address", StringConverter,false)
        Spouse_Address: string="";

        @JsonProperty("Spouse_City", StringConverter,false)
        Spouse_City: string="";

        @JsonProperty("Spouse_State", StringConverter,false)
        Spouse_State: string="";

        @JsonProperty("Spouse_Zip", StringConverter,false)
        Spouse_Zip: string="";

        @JsonProperty("Spouse_Phone", StringConverter,false)
        Spouse_Phone: string="";

        @JsonProperty("Spouse_Email", StringConverter,false)
        Spouse_Email: string="";

        @JsonProperty("Spouse_Preferred_Contact_Ind", IntConverter,false)
        Spouse_Preferred_Contact_Ind: number=undefined;

        @JsonProperty("Date_Time", StringConverter,false)
        Date_Time: string ="";

        @JsonProperty("Status", IntConverter,false)
        Status: number=undefined;

        @JsonProperty("ActionStatus", IntConverter,false)
        ActionStatus: number=undefined;

        FC_Borrower_TotalAssets:number=0;
        FC_Borrower_TotalDebt:number=0;
        FC_Borrower_TotalEquity:number=0;
        FC_Borrower_Current_Equity:number=0;
        FC_Borrower_Intermediate_Equity:number=0;
        FC_Borrower_Fixed_Equity:number=0;
        FC_Borrower_NetRatio:number=0;
        FC_Borrower_Current_Ratio:number=0;
        FC_Borrower_FICO:number=0;
        //for balancesheet
        FC_Borrower_Current_Adjvalue:number=0;
        FC_Borrower_Intermediate_Adjvalue:number=0;
        FC_Borrower_Fixed_Adjvalue:number=0;
        FC_Borrower_Total_Adjvalue:number=0;
        FC_Borrower_Current_Discvalue:number=0;
        FC_Borrower_Intermediate_Discvalue:number=0;
        FC_Borrower_Fixed_Discvalue:number=0;
        FC_Borrower_Total_Discvalue:number=0;
        App_Logpriority:Logpriority=Logpriority.VeryHigh;

    }
    @JsonObject
    export class Loan_Association
    {
        @JsonProperty("Assoc_ID", IntConverter,false)
        Assoc_ID: number=0;
        @JsonProperty("Loan_ID", IntConverter,false)
        Loan_ID: number=0;
        @JsonProperty("Loan_Seq_Num", IntConverter,false)
        Loan_Seq_Num: number=0;
        @JsonProperty("Loan_Full_ID", StringConverter,false)
        Loan_Full_ID: string='';
        @JsonProperty("Assoc_Type_Code", StringConverter,false)
        Assoc_Type_Code: string='';
        @JsonProperty("Assoc_Name", StringConverter,false)
        Assoc_Name: string='';
        @JsonProperty("Contact", StringConverter,false)
        Contact: string='';
        @JsonProperty("Location", StringConverter,false)
        Location: string='';
        @JsonProperty("Phone", StringConverter,false)
        Phone: string='';
        @JsonProperty("Email", StringConverter,false)
        Email: string='';
        @JsonProperty("Amount", IntConverter,false)
        Amount: number=0;
        @JsonProperty("Preferred_Contact_Ind", IntConverter,false)
        Preferred_Contact_Ind: number=0;
        @JsonProperty("Assoc_Status", IntConverter,false)
        Assoc_Status: number=undefined;
        @JsonProperty("Status", IntConverter,false)
        Status: number=0;
        @JsonProperty("ActionStatus", IntConverter,false)
        ActionStatus: number=undefined;

    }
    @JsonObject
    export class loan_model{

        @JsonProperty("Borrower", borrower_model)
        Borrower: borrower_model=undefined;

        @JsonProperty("LoanCropUnits", [Loan_Crop_Unit])
        LoanCropUnits:Loan_Crop_Unit[]=undefined;

        @JsonProperty("CropYield", [])
        CropYield:any=undefined;

        @JsonProperty("Farms", [Loan_Farm])
        Farms:Loan_Farm[]=undefined;

        @JsonProperty("LoanQResponse", [])
        LoanQResponse:any=undefined;

        @JsonProperty("LoanBudget",[])
        LoanBudget:any=undefined;

        @JsonProperty("Loan_PK_ID", IntConverter)
        Loan_PK_ID:number=undefined;

        @JsonProperty("Association", [Loan_Association])
        Association: Loan_Association[]=undefined;

        @JsonProperty("LoanMaster", [])
        LoanMaster: any = undefined;
        
        LoanCropUnitFCvalues:Loan_Crop_Unit_FC=new Loan_Crop_Unit_FC();

    }
     



    export class Loan_Budget
    {   
        @JsonProperty("Loan_Budget_ID", IntConverter,false)
        Loan_Budget_ID: number;
        @JsonProperty("Loan_ID", IntConverter,false)
        Loan_ID: number;
        @JsonProperty("Z_Loan_Seq_num", StringConverter,false)
        Z_Loan_Seq_num: string="";
        @JsonProperty("Loan_Full_ID", StringConverter,false)
        Loan_Full_ID: string="";
        @JsonProperty("Z_Loan_CU_ID", IntConverter,false)
        Z_Loan_CU_ID: number=0;
        @JsonProperty("Z_Expense_Type_Code", IntConverter,false)
        Z_Expense_Type_Code: number=0;
        @JsonProperty("ARM_Budget_Acre", IntConverter,false)
        ARM_Budget_Acre: number=0;
        @JsonProperty("Distributor_Budget_Acre", IntConverter,false)
        Distributor_Budget_Acre: number=0;
        @JsonProperty("Third_Party_Budget_Acre", IntConverter,false)
        Third_Party_Budget_Acre: number=0;
        @JsonProperty("BudgetTotal_Acre", IntConverter,false)
        BudgetTotal_Acre: number=0;
        @JsonProperty("ARM_Budget_Crop", IntConverter,false)
        ARM_Budget_Crop: number=0;
        @JsonProperty("Distributor_Budget_Crop", IntConverter,false)
        Distributor_Budget_Crop: number=0;
        @JsonProperty("Third_Party_Budget_Crop", IntConverter,false)
        Third_Party_Budget_Crop: number=0;
        @JsonProperty("BudgetTotal_Crop", IntConverter,false)
        BudgetTotal_Crop: number=0;
        @JsonProperty("Notes", StringConverter,false)
        Notes: string="";
        @JsonProperty("Other_Description_Text", StringConverter,false)
        Other_Description_Text: string="";

        @JsonProperty("Crop_Code", StringConverter,false)
        Crop_Code: string="";
        @JsonProperty("Crop_Practice_Type_Code", StringConverter,false)
        Crop_Practice_Type_Code: string="";
        @JsonProperty("Budget_Expense_Name", StringConverter,false)
        Budget_Expense_Name: string="";

        @JsonProperty("Status", IntConverter,false)
        Status: number=0;
        @JsonProperty("ActionStatus", IntConverter,false)
        ActionStatus: number=0;

    }

    export class loan_borrower{
        Loan_ID  : number;
        Borrower_Last_Name : string; 
        Borrower_First_Name  : string;
        Borrower_MI : string;
        Borrower_Address : string;
        Borrower_City : string;
        Borrower_State_ID : string;
        Borrower_Zip : number;
        Borrower_Phone : string;
        Borrower_email : string;
        Borrower_DOB : Date;
        Borrower_SSN_Hash : string;
        Borrower_Entity_Type_Code : number;
        Spouse_Last_name : string;
        Spouse_First_Name : string;
        Spouse__MI : string;
        Spouse_Phone : string;
        Spouse_Email : string;
    }

    export class loan_farmer{
        Farmer_SSN_Hash : string;
        Farmer_Last_Name : string;
        Farmer_First_Name : string;
        Farmer_MI : string;
        Farmer__Address : string;
        Farmer_City : string;
        Farmer_State : string;
        Farmer_Zip : number
        Farmer_Phone : string;
        Farmer_Email : string;
        Year_Begin_Farming : number;
        Year_Begin_Client :number;
    }
    export class borrower_income_history_model
    {
        BIH_ID: number=undefined;
        Loan_ID: number=undefined;
        Borrower_Year: number=undefined;;
        Borrower_Expense: number=undefined;
        Borrower_Revenue: number=undefined;
        Borrower_Income: number=undefined;
    }
    export enum Logpriority{
        Low=1,//Logs all events
        High,
        VeryHigh
    }
    export class Logs
    {
        Log_Id: number;
        Log_Section: string;
        Log_Message: string;

    }
