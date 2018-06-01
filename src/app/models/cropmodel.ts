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
    @JsonProperty("Price", IntConverter,false)
    Price: number=undefined;
    @JsonProperty("Basis_Adj", IntConverter,false)
    Basis_Adj: number =undefined;
    @JsonProperty("Marketing_Adj", IntConverter,false)
    Marketing_Adj: number=undefined;
    @JsonProperty("Rebate_Adj", IntConverter,false)
    Rebate_Adj: number=undefined;
    @JsonProperty("Adj_Price", IntConverter,false)
    Adj_Price: number =undefined;
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


