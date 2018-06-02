import { JsonProperty, JsonObject, JsonConverter, JsonCustomConvert } from "json2typescript";
import { IntConverter, StringConverter } from "../Workers/utility/jsonconvertors";
export class Loan_Farm
{
    Farm_ID: number;
    Loan_Full_ID: number | null;
    Farm_State_ID: string;
    Farm_County_ID: number | null;
    FSN: string;
    Section: string;
    Rated: string;
    Owned: number | null;
    Landowner: string;
    Share_Rent: number | null;
    Cash_Rent_Total: number | null;
    Cash_Rent_Per_Acre: number | null;
    Cash_Rent_Due_Date: Date | string | null;
    Cash_Rent_Paid: number | null;
    Permission_To_Insure: number | null;
    Cash_Rent_Waived: number | null;
    Cash_Rent_Waived_Amount: number | null;
    Irr_Acres: number | null;
    NI_Acres: number | null;
    Crop_share_Detail_Indicator: number | null;
    Status: number | null;
}
