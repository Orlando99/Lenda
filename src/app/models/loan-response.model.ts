import {JsonProperty} from 'json2typescript';
import {IntConverter, StringConverter} from '../Workers/utility/jsonconvertors';

export class LoanQResponse {
  @JsonProperty("Loan_Q_response_ID", IntConverter,false)
  Loan_Q_response_ID: number;

  @JsonProperty("Loan_ID", IntConverter,false)
  Loan_ID: number;

  @JsonProperty("Loan_Seq_Num", IntConverter,false)
  Loan_Seq_Num: number;

  @JsonProperty("Loan_Full_ID", StringConverter,false)
  Loan_Full_ID: string;

  @JsonProperty("Question_ID", IntConverter,false)
  Question_ID: number;

  @JsonProperty("Response_Ind", IntConverter,false)
  Response_Ind: number;

  @JsonProperty("Question_Category_Code", IntConverter,false)
  Question_Category_Code: number;

  @JsonProperty("Response_Detail_Text", StringConverter,false)
  Response_Detail_Text: string

  @JsonProperty("Response_Detail_Value", IntConverter,false)
  Response_Detail_Value: number;

  @JsonProperty("Response_Detail_Field_ID", IntConverter,false)
  Response_Detail_Field_ID: number;

  @JsonProperty("Status", IntConverter,false)
  Status: number;
}

export class RefQuestions {
  @JsonProperty("Question_ID", IntConverter,false)
  Question_ID: number;
  @JsonProperty("Question_ID_Text", StringConverter,false)
  Question_ID_Text: string;
  @JsonProperty("Questions_Cat_Code", IntConverter,false)
  Questions_Cat_Code: number;
  @JsonProperty("Response_Detail_Reqd_Ind", IntConverter,false)
  Response_Detail_Reqd_Ind: number;
  @JsonProperty("Sort_Order", IntConverter,false)
  Sort_Order: number;
  @JsonProperty("Status", IntConverter,false)
  Status: number;
  @JsonProperty("Subsidiary_Question_ID", IntConverter,false)
  Subsidiary_Question_ID: number;
  @JsonProperty("Subsidiary_Question_ID_Ind", IntConverter,false)
  Subsidiary_Question_ID_Ind: number;
}
