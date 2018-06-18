import { JsonProperty, JsonObject, JsonConverter, JsonCustomConvert } from "json2typescript";
import { IntConverter, StringConverter } from "../Workers/utility/jsonconvertors";
@JsonObject
export class Loan_Farm
{
    @JsonProperty("Farm_ID", IntConverter,false)
    Farm_ID: number=undefined;
    @JsonProperty("Loan_Full_ID", StringConverter,false)
    Loan_Full_ID: string='';
    @JsonProperty("Farm_State_ID", IntConverter,false)
    Farm_State_ID: number=0;
    @JsonProperty("Farm_County_ID", IntConverter,false)
    Farm_County_ID: number=0;
    @JsonProperty("FSN", StringConverter,false)
    FSN: string='';
    @JsonProperty("Section", StringConverter,false)
    Section: string='';
    @JsonProperty("Rated", StringConverter,false)
    Rated: string='';
    @JsonProperty("Owned", IntConverter,false)
    Owned: number=0;
    @JsonProperty("Landowner", StringConverter,false)
    Landowner: string='';
    @JsonProperty("Share_Rent", IntConverter,false)
    Share_Rent: number=0;
    @JsonProperty("Cash_Rent_Total", IntConverter,false)
    Cash_Rent_Total: number=0;
    @JsonProperty("Cash_Rent_Per_Acre", IntConverter,false)
    Cash_Rent_Per_Acre: number=0;
    @JsonProperty("Cash_Rent_Due_Date", StringConverter,false)
    Cash_Rent_Due_Date: string='';
    @JsonProperty("Cash_Rent_Paid", IntConverter,false)
    Cash_Rent_Paid: number=0;
    @JsonProperty("Permission_To_Insure", IntConverter,false)
    Permission_To_Insure: number=0;
    @JsonProperty("Cash_Rent_Waived", IntConverter,false)
    Cash_Rent_Waived: number=0;
    @JsonProperty("Cash_Rent_Waived_Amount", IntConverter,false)
    Cash_Rent_Waived_Amount: number=0;
    @JsonProperty("Irr_Acres", IntConverter,false)
    Irr_Acres: number=0;
    @JsonProperty("NI_Acres", IntConverter,false)
    NI_Acres: number=0;
    @JsonProperty("Crop_share_Detail_Indicator", IntConverter,false)
    Crop_share_Detail_Indicator: number=0;
    @JsonProperty("Status", IntConverter,false)
    Status: number=0;

    @JsonProperty("ActionStatus", IntConverter,false)
    ActionStatus: number=undefined;
    FC_Total_Acres:number;
    
}
