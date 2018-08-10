import { JsonObject, JsonProperty } from "json2typescript";
import { IntConverter, StringConverter } from "../Workers/utility/jsonconvertors";

@JsonObject
export class Insurance_Policy
{
    @JsonProperty("Policy_id", IntConverter)
    Policy_id:number=undefined;

    @JsonProperty("Agent_Id", IntConverter)
    Agent_Id:number=undefined;

    @JsonProperty("State_Id", IntConverter)
    State_Id:number=undefined;

    @JsonProperty("Crop_Practice_Id", IntConverter)
    Crop_Practice_Id:number=undefined;

    @JsonProperty("ProposedAIP", StringConverter)
    ProposedAIP:string=undefined;

    @JsonProperty("County_Id", IntConverter)
    County_Id:number=undefined;

    @JsonProperty("Rated", StringConverter)
    Rated:string=undefined;

    @JsonProperty("MPCI_Subplan", StringConverter)
    MPCI_Subplan:string=undefined;

    @JsonProperty("Option", StringConverter)
    Option:string=undefined;

    @JsonProperty("Unit", StringConverter)
    Unit:string=undefined;

    @JsonProperty("Level", IntConverter)
    Level:number=undefined;
    
   
    @JsonProperty("Price", IntConverter)
    Price:number=undefined;
    
    @JsonProperty("Premium", IntConverter)
    Premium:number=undefined;

    @JsonProperty("HasSecondaryPlans",true)
    HasSecondaryPlans:boolean=undefined;
    
    @JsonProperty("Subpolicies", [])
    Subpolicies:Insurance_Subpolicy[]=[];
    
    ActionStatus:number=0;
    

}


@JsonObject
export class Insurance_Subpolicy
{
    @JsonProperty("SubPolicy_Id", IntConverter)
    SubPolicy_Id:number=undefined;
    @JsonProperty("FK_Policy_Id", IntConverter)
    FK_Policy_Id:number=undefined;
    @JsonProperty("Ins_Type", StringConverter)
    Ins_Type:string=undefined;
    @JsonProperty("Ins_SubType", StringConverter)
    Ins_SubType:string=undefined;
    @JsonProperty("Upper_Limit", IntConverter)
    Upper_Limit:number=undefined;
    @JsonProperty("Lower_Limit", IntConverter)
    Lower_Limit:number=undefined;
    @JsonProperty("Price_Pct", IntConverter)
    Price_Pct:number=undefined;
    @JsonProperty("Yield_Pct", IntConverter)
    Yield_Pct:number=undefined;
    @JsonProperty("Premium", IntConverter)
    Premium:number=undefined;
    @JsonProperty("Prot_Factor", IntConverter)
    Prot_Factor:number=undefined;
    @JsonProperty("Wind", IntConverter)
    Wind:number=undefined;
    @JsonProperty("Yield", IntConverter)
    Yield:number=undefined;
    @JsonProperty("Liability", IntConverter)
    Liability:number=undefined;
    @JsonProperty("FCMC", IntConverter)
    FCMC:number=undefined;
    @JsonProperty("Deduct", IntConverter)
    Deduct:number=undefined;
    Icc:number=0;
    ActionStatus:number=0;
}