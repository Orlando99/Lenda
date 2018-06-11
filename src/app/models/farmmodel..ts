import { JsonProperty, JsonObject, JsonConverter, JsonCustomConvert } from "json2typescript";
import { IntConverter, StringConverter } from "../Workers/utility/jsonconvertors";
@JsonObject
export class Loan_Farm
{
    @JsonProperty("Farm_ID", IntConverter,false)
    Farm_ID: number=undefined;
    @JsonProperty("Loan_Full_ID", IntConverter,false)
    Loan_Full_ID: number=undefined;
    @JsonProperty("Farm_State_ID", StringConverter,false)
    Farm_State_ID: string=undefined;
    @JsonProperty("Farm_County_ID", IntConverter,false)
    Farm_County_ID: number=undefined;
    @JsonProperty("FSN", StringConverter,false)
    FSN: string=undefined;
    @JsonProperty("Section", StringConverter,false)
    Section: string=undefined;
    @JsonProperty("Rated", StringConverter,false)
    Rated: string=undefined;
    @JsonProperty("Owned", IntConverter,false)
    Owned: number=undefined;
    @JsonProperty("Landowner", StringConverter,false)
    Landowner: string=undefined;
    @JsonProperty("Share_Rent", IntConverter,false)
    Share_Rent: number=undefined;
    @JsonProperty("Cash_Rent_Total", IntConverter,false)
    Cash_Rent_Total: number=undefined;
    @JsonProperty("Cash_Rent_Per_Acre", IntConverter,false)
    Cash_Rent_Per_Acre: number=undefined;
    @JsonProperty("Cash_Rent_Due_Date", StringConverter,false)
    Cash_Rent_Due_Date: string=undefined;
    @JsonProperty("Cash_Rent_Paid", IntConverter,false)
    Cash_Rent_Paid: number=undefined;
    @JsonProperty("Permission_To_Insure", IntConverter,false)
    Permission_To_Insure: number=undefined;
    @JsonProperty("Cash_Rent_Waived", IntConverter,false)
    Cash_Rent_Waived: number=undefined;
    @JsonProperty("Cash_Rent_Waived_Amount", IntConverter,false)
    Cash_Rent_Waived_Amount: number=undefined;
    @JsonProperty("Irr_Acres", IntConverter,false)
    Irr_Acres: number=undefined;
    @JsonProperty("NI_Acres", IntConverter,false)
    NI_Acres: number=undefined;
    @JsonProperty("Crop_share_Detail_Indicator", IntConverter,false)
    Crop_share_Detail_Indicator: number=undefined;
    @JsonProperty("Status", IntConverter,false)
    Status: number=undefined;

    FC_Total_Acres:number;
    
}
