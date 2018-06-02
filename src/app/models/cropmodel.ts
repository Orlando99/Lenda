import { JsonProperty, JsonObject, JsonConverter, JsonCustomConvert } from "json2typescript";
import { IntConverter, StringConverter } from "../Workers/utility/jsonconvertors";

@JsonObject
export class Loan_Crop_Unit
{
    @JsonProperty("Loan_CU_ID", IntConverter,false)
    Loan_CU_ID: number=undefined;
    @JsonProperty("Loan_ID", IntConverter,false)
    Loan_ID: number=undefined;
    @JsonProperty("CU_Acres", IntConverter,false)
    CU_Acres: number=undefined;
    @JsonProperty("Crop_Type_Code", StringConverter,false)
    Crop_Type_Code: string=undefined;
    @JsonProperty("Crop_Code", StringConverter,false)
    Crop_Code: string=undefined;
    @JsonProperty("Crop_Practice_Type_Code", StringConverter,false)
    Crop_Practice_Type_Code: string=undefined;
    @JsonProperty("Z_Price", IntConverter,false)
    Z_Price: number=undefined;
    @JsonProperty("Z_Basis_Adj", IntConverter,false)
    Z_Basis_Adj: number =undefined;
    @JsonProperty("Z_Marketing_Adj", IntConverter,false)
    Z_Marketing_Adj: number=undefined;
    @JsonProperty("Z_Rebate_Adj", IntConverter,false)
    Z_Rebate_Adj: number=undefined;
    @JsonProperty("Z_Adj_Price", IntConverter,false)
    Z_Adj_Price: number =undefined;
    @JsonProperty("Booking_Ind", IntConverter,false)
    Booking_Ind: number=undefined;
    @JsonProperty("Status", IntConverter,false)
    Status: number=undefined;

    FC_Revenue: number=0;
}

export class Loan_Crop_Unit_FC{
    FC_TotalRevenue:number=0;
    FC_TotalBudget:number=0;
    FC_EstimatedInterest:number=0;
    FC_TotalCashFlow:number=0;    
    FC_SubtotalCropRevenue:number=0;
    FC_SubTotalAcres:number=0;
}

export class Loan_Crop_History_FC{
    FC_Crop_Type_Code:string;
    FC_Crop_Yield:number=0;
    FC_Crop_APH:number=0;
}

@JsonObject
export class V_Crop_Price_Details
{
    @JsonProperty("Crop_ID", IntConverter,false)
    Crop_ID: number=undefined;
    
    @JsonProperty("Crop_Code", StringConverter,false)
    Crop_Code: string=undefined;
    
    @JsonProperty("Crop_Name", StringConverter,false)
    Crop_Name: string=undefined;
    
    @JsonProperty("Crop_Type_Code", StringConverter,false)
    Crop_Type_Code: string=undefined;
    
    @JsonProperty("Crop_Type_Name", StringConverter,false)
    Crop_Type_Name: String=undefined;
    
    @JsonProperty("Practice_type_code", StringConverter,false)
    Practice_type_code: String=undefined;
    
    @JsonProperty("Irr_NI_Ind", IntConverter,false)
    Irr_NI_Ind: number=undefined;
    
    @JsonProperty("State_ID", StringConverter,false)
    State_ID: String=undefined;
    
    @JsonProperty("Std_Crop_Type_Practice_Type_Ind", IntConverter,false)
    Std_Crop_Type_Practice_Type_Ind: number=undefined;
    
    @JsonProperty("Final_Planting_Date", StringConverter,false)
    Final_Planting_Date: String=undefined;
    
    @JsonProperty("Region_ID", StringConverter,false)
    Region_ID: String=undefined;
    
    @JsonProperty("Office_ID", StringConverter,false)
    Office_ID: String=undefined;

    
    @JsonProperty("Crop_Year", IntConverter,false)
    Crop_Year: number=undefined;
    
    @JsonProperty("MPCI_UOM", StringConverter,false)
    MPCI_UOM: String=undefined;
    
    @JsonProperty("Price", IntConverter,false)
    Price: number=undefined;
    
    @JsonProperty("Basis", IntConverter,false)
    Basis: number=undefined;

    @JsonProperty("Rebate", IntConverter,false)
    Rebate: number=undefined;
    
    @JsonProperty("Adj_Price", IntConverter,false)
    Adj_Price: number=undefined;

    @JsonProperty("Status", IntConverter,false)
    Status: number=undefined;

}

@JsonObject
export class Loan_Crop_Type_Practice_Type_Yield
{
    
    @JsonProperty("Loan_Crop_Type_Practice_Type_ID", IntConverter,false)
    Loan_Crop_Type_Practice_Type_ID: number=undefined;
    
    @JsonProperty("Loan_ID", IntConverter,false)
    Loan_ID: number=undefined;
    
    @JsonProperty("Loan_Seq_Num", IntConverter,false)
    Loan_Seq_Num: number=undefined;
    
    @JsonProperty("Crop_Type_Code", StringConverter,false)
    Crop_Type_Code: string=undefined;
    
    @JsonProperty("Practice_Type_Code", StringConverter,false)
    Practice_Type_Code: string=undefined;
    
    @JsonProperty("Yield_Line", StringConverter,false)
    Yield_Line: string=undefined;
    
    @JsonProperty("Crop_Yield", IntConverter,false)
    Crop_Yield: number=undefined;
    
    @JsonProperty("Crop_Year", IntConverter,false)
    Crop_Year: number=undefined;
    
    @JsonProperty("Status", IntConverter,false)
    Status: number=undefined;

}

