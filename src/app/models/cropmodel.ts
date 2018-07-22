import { JsonProperty, JsonObject, JsonConverter, JsonCustomConvert } from "json2typescript";
import { IntConverter, StringConverter } from "../Workers/utility/jsonconvertors";

@JsonObject
export class Loan_Crop_Unit
{
    @JsonProperty("Loan_CU_ID", IntConverter,false)
    Loan_CU_ID: number=undefined;
    @JsonProperty("Loan_ID", IntConverter,false)
    Loan_ID: number=0;
    @JsonProperty("Farm_ID", IntConverter,false)
    Farm_ID: number=0;
    @JsonProperty("Loan_Full_ID", StringConverter,false)
    Loan_Full_ID: string='';
    @JsonProperty("CU_Acres", IntConverter,false)
    CU_Acres: number=0;
    @JsonProperty("CU_APH", IntConverter,false)
    CU_APH: number=0;
    @JsonProperty("Crop_Type_Code", StringConverter,false)
    Crop_Type_Code: string="";
    @JsonProperty("Crop_Code", StringConverter,false)
    Crop_Code: string="";
    @JsonProperty("Crop_Practice_Type_Code", StringConverter,false)
    Crop_Practice_Type_Code: string="";
    @JsonProperty("Crop_Practice_ID", IntConverter,false)
    Crop_Practice_ID: number=0;
    @JsonProperty("Z_Price", IntConverter,false)
    Z_Price: number=0;
    @JsonProperty("Z_Basis_Adj", IntConverter,false)
    Z_Basis_Adj: number =0;
    @JsonProperty("Z_Marketing_Adj", IntConverter,false)
    Z_Marketing_Adj: number=0;
    @JsonProperty("Z_Rebate_Adj", IntConverter,false)
    Z_Rebate_Adj: number=0;
    @JsonProperty("Z_Adj_Price", IntConverter,false)
    Z_Adj_Price: number =0;
    @JsonProperty("Booking_Ind", IntConverter,false)
    Booking_Ind: number=0;
    @JsonProperty("Status", IntConverter,false)
    Status: number=0;
    @JsonProperty("ActionStatus", IntConverter,false)
    ActionStatus: number=0;
     // New Properties
     @JsonProperty("Ins_Value", IntConverter,false)
     Ins_Value: number=0;
     @JsonProperty("Disc_Ins_value", IntConverter)
     Disc_Ins_value: number=0;
     @JsonProperty("Mkt_Value", IntConverter)
     Mkt_Value: number=0;
     @JsonProperty("Disc_Mkt_Value", IntConverter,)
     Disc_Mkt_Value: number=0;
     @JsonProperty("CEI_Value", IntConverter)
     CEI_Value: number=0;
     @JsonProperty("Disc_CEI_Value", IntConverter)
     Disc_CEI_Value: number=0;
     // FC Values
     FC_CountyID:number;
     FC_FSN:string
     FC_Section:string
     FC_Rating:string;
     FC_Ins_Unit:string;
     FC_Ins_Policy_ID:number
     FC_CropYield:number;
     FC_Primary_limit:number;
     FC_Stax:number;
     FC_SCO:number;
     FC_Revenue: number=0;
     FC_Insurance_Share:number=0;
     FC_ModifiedAPH:number=0;
     FC_MPCIvalue:number=0;
     FC_Disc_MPCI_value:number=0;
     FC_Hmaxvalue:number=0;
     FC_Disc_Hmaxvalue:number=0;
     FC_Staxvalue:number=0;
     FC_Disc_Staxvalue:number=0;
     FC_Scovalue:number=0;
     FC_Disc_Scovalue:number=0;
     FC_Level1Perc:number=undefined;

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
    @JsonProperty("Crop_And_Practice_ID", StringConverter,false)
    Crop_And_Practice_ID: string=undefined;

    // @JsonProperty("Crop_ID", IntConverter,false)
    // Crop_ID: number=undefined;
    
    @JsonProperty("Crop_Code", StringConverter,false)
    Crop_Code: string=undefined;
    
    @JsonProperty("Crop_Name", StringConverter,false)
    Crop_Name: string=undefined;
    
    @JsonProperty("Crop_Type_Name", StringConverter,false)
    Crop_Type_Name: String=undefined;
    
    @JsonProperty("Practice_type_code", StringConverter,false)
    Practice_type_code: String=undefined;
    
    @JsonProperty("Irr_NI_Ind", IntConverter,false)
    Irr_NI_Ind: number=undefined;
    
    @JsonProperty("State_ID", StringConverter,false)
    State_ID: String=undefined;

    @JsonProperty("RMA_Ref_Yield", IntConverter,false)
    RMA_Ref_Yield: number=undefined;
    
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

// @JsonObject
// export class Loan_Crop_Type_Practice_Type_Yield
// {
    
//     @JsonProperty("Loan_Crop_Type_Practice_Type_ID", IntConverter,false)
//     Loan_Crop_Type_Practice_Type_ID: number=undefined;
    
//     @JsonProperty("Loan_ID", IntConverter,false)
//     Loan_ID: number=undefined;
    
//     @JsonProperty("Loan_Seq_Num", IntConverter,false)
//     Loan_Seq_Num: number=undefined;
    
//     @JsonProperty("Crop_Type_Code", StringConverter,false)
//     Crop_Type_Code: string=undefined;
    
//     @JsonProperty("Practice_Type_Code", StringConverter,false)
//     Practice_Type_Code: string=undefined;
    
//     @JsonProperty("Yield_Line", StringConverter,false)
//     Yield_Line: string=undefined;
    
//     @JsonProperty("Crop_Yield", IntConverter,false)
//     Crop_Yield: number=undefined;
    
//     @JsonProperty("Crop_Year", IntConverter,false)
//     Crop_Year: number=undefined;
    
//     @JsonProperty("Status", IntConverter,false)
//     Status: number=undefined;

// }


export class Loan_Crop_Type_Practice_Type_Yield_EditModel
    {
        CropId: number | null;
        LoanFullID: string | null;
        PropertyName: string;
        PropertyValue: string;
        CropYear: number | null;
        YieldLine: number | null;
        IsPropertyYear: boolean;
    }


    export class Loan_Crop_Type_Practice_Type_Yield_AddModel
    {
        // Crop_ID: number;
        // Loan_ID: number;
        // Z_Crop_Name: string;
        // Loan_Seq_Num: number;
        // Z_Crop_Type_Code: string | null;
        // Z_Practice_Type_Code: number | null;
        // Crop_Year: number;
        // Yield_Line: string | null;
        // Crop_Yield: number | null;
        // Status: number;
        // Loan_Full_ID: string;

        Crop: number;
        CropType: number;
        Crop_ID: string;
        Loan_ID: number;
        IrNI: string | null;
        Practice: number | null;
        CropYield: number | null;
        APH: number;
        InsUOM: string;

    }