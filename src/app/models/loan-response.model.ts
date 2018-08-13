import {JsonProperty} from 'json2typescript';
import {IntConverter, StringConverter} from '../Workers/utility/jsonconvertors';


export enum Operation {
  Greater = '>',
  Equal = '=',
  GreterEqual = '>='
}
export class LoanQResponse {
  @JsonProperty("Loan_Q_response_ID", IntConverter,false)
  Loan_Q_response_ID: number;

  @JsonProperty("Loan_ID", IntConverter,false)
  Loan_ID: number;

  @JsonProperty("Loan_Seq_Num", IntConverter,false)
  Loan_Seq_Num: number;

  @JsonProperty("Loan_Full_ID", StringConverter,false)
  Loan_Full_ID: string;

  @JsonProperty("Chevron_ID", StringConverter,false)
  Chevron_ID: string;

  @JsonProperty("Question_ID", IntConverter,false)
  Question_ID: number;

  @JsonProperty("Question_Category_Code", IntConverter,false)
  Question_Category_Code: number;

  @JsonProperty("Response_Detail", StringConverter,false)
  Response_Detail: string

  @JsonProperty("Response_Detail_Field_ID", IntConverter,false)
  Response_Detail_Field_ID: number;

  @JsonProperty("Status", IntConverter,false)
  Status: number;

  @JsonProperty("ActionStatus", IntConverter,false)
  ActionStatus: number;

  FC_Question_ID_Text : string;
  FC_Choice1 :string;
  FC_Choice2 : string;
  FC_Subsidiary_Question_ID_Ind : number;
  FC_Parent_Question_ID : number;
  FC_Sort_Order : number;
  FC_Exception_Msg: string;
  FC_Operation: Operation;
  FC_Level1_Val: string;
  FC_Level2_Val: string;

}

export class RefQuestions {
  @JsonProperty("Question_ID", IntConverter,false)
  Question_ID: number;
  @JsonProperty("Question_ID_Text", StringConverter,false)
  Question_ID_Text: string;
  @JsonProperty("Chevron_ID", StringConverter,false)
  Chevron_ID: string;
  @JsonProperty("Sort_Order", IntConverter,false)
  Sort_Order: number;
  @JsonProperty("Questions_Cat_Code", IntConverter,false)
  Questions_Cat_Code: number;
  @JsonProperty("Response_Detail_Reqd_Ind", IntConverter,false)
  Response_Detail_Reqd_Ind: number;
  @JsonProperty("Subsidiary_Question_ID_Ind", IntConverter,false)
  Subsidiary_Question_ID_Ind: number;
  @JsonProperty("Parent_Question_ID", IntConverter,false)
  Parent_Question_ID: number;
  @JsonProperty("Status", IntConverter,false)
  Status: number;
  @JsonProperty("Choice1", StringConverter,false)
  Choice1: string;
  @JsonProperty("Choice2", StringConverter,false)
  Choice2: string;
  @JsonProperty("Exception_Msg", StringConverter,false)
  Exception_Msg: string;
  @JsonProperty("Operation", StringConverter,false)
  Operation: Operation;
  @JsonProperty("Level1_Val", StringConverter,false)
  Level1_Val: string;
  @JsonProperty("Level2_Val", StringConverter,false)
  Level2_Val: string;
  
}

