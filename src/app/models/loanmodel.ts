import { JsonProperty, JsonObject, JsonConverter, JsonCustomConvert } from "json2typescript";
import { Loan_Crop_Unit, Loan_Crop_Unit_FC, V_Crop_Price_Details, Loan_Crop_History_FC } from "./cropmodel";
import { IntConverter, StringConverter } from "../Workers/utility/jsonconvertors";
import { Loan_Farm } from "./farmmodel.";


@JsonObject
export class borrower_model
    {
        @JsonProperty("Borrower_Loan_Id", IntConverter,false)
        Borrower_Loan_Id: number=undefined;

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
    export class loan_model{

        @JsonProperty("Borrower", borrower_model)
        Borrower: borrower_model=undefined;

        @JsonProperty("LoanCropUnits", [Loan_Crop_Unit])
        LoanCropUnits:Loan_Crop_Unit[]=undefined;
        
        @JsonProperty("CropYield", [])
        CropYield:any=undefined;
        
        @JsonProperty("Farms", [Loan_Farm])
        Farms:Loan_Farm[]=undefined;
        
        LoanCropUnitFCvalues:Loan_Crop_Unit_FC=new Loan_Crop_Unit_FC();

        CropYieldHistoryFCvalues:Array<Loan_Crop_History_FC>=new Array<Loan_Crop_History_FC>();
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