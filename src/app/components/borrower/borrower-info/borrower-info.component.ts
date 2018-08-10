import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, loan_borrower, Loan_Association } from '../../../models/loanmodel';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { JsonConvert } from 'json2typescript';
@Component({
  selector: 'app-borrower-info',
  templateUrl: './borrower-info.component.html',
  styleUrls: ['./borrower-info.component.scss']
})
export class BorrowerInfoComponent implements OnInit {

  borrowerInfoForm: FormGroup;
  localloanobj: loan_model;
  stateList: Array<any>;
  entityType = [
    { key: 'IND', value: 'Individual' },
    { key: 'INDWS', value: 'Individual w/ Spouse' },
    { key: 'PRP', value: 'Partner' },
    { key: 'JNT', value: 'Joint' },
    { key: 'COP', value: 'Corporation' },
    { key: 'LLC', value: 'LLC' },
  ];
  associationTypeCodes = ['PRP','JNT','COP','LLC'];
  selectedAssociaionTypeCode : string = '';
  loan_id: number;
  isSubmitted: boolean; // to enable or disable the sync button as there is not support to un-dirty the form after submit
  public columnDefs = [];
  public components;
  public refdata;
  public frameworkcomponents;
  public context;
  public rowData = [];
  public gridApi;
  public columnApi;

  //in this case local storage Associaltion list have other rows as well, so simply lading picking the record from rowIndex won't work
  private latestUpdatedObject;

  @Input('allowIndividualSave')
  allowIndividualSave: boolean;
  @Input('mode')
  mode: string;
  @Output('onFormValueChange')
  onFormValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() set borrowerInfo(borrowerInfo) {
    if (borrowerInfo) {
      let borrower = new loan_borrower();
      borrower.Borrower_First_Name = borrowerInfo.value.Farmer_First_Name ? borrowerInfo.value.Farmer_First_Name.slice() : "";
      borrower.Borrower_Last_Name = borrowerInfo.value.Farmer_Last_Name ? borrowerInfo.value.Farmer_Last_Name.slice() : "";
      borrower.Borrower_Address = borrowerInfo.value.Farmer__Address ? borrowerInfo.value.Farmer__Address.slice() : "";
      borrower.Borrower_City = borrowerInfo.value.Farmer_City ? borrowerInfo.value.Farmer_City.slice() : "";
      borrower.Borrower_DOB = borrowerInfo.value.Farmer_DOB ? borrowerInfo.value.Farmer_DOB.slice() : "";
      borrower.Borrower_Phone = borrowerInfo.value.Farmer_Phone ? borrowerInfo.value.Farmer_Phone.slice() : "";
      borrower.Borrower_Zip = borrowerInfo.value.Farmer_Zip ? borrowerInfo.value.Farmer_Zip.slice() : "";
      borrower.Borrower_email = borrowerInfo.value.Farmer_Email ? borrowerInfo.value.Farmer_Email.slice() : "";
      borrower.Borrower_MI = borrowerInfo.value.Farmer_MI ? borrowerInfo.value.Farmer_MI.slice() : "";
      borrower.Borrower_SSN_Hash = borrowerInfo.value.Farmer_SSN_Hash ? borrowerInfo.value.Farmer_SSN_Hash.slice() : "";
      borrower.Borrower_State_ID = borrowerInfo.value.Farmer_State ? borrowerInfo.value.Farmer_State.slice() : "";
      this.createForm(borrower);
    }
  }

  constructor(private fb: FormBuilder, public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public logging: LoggingService,
    private loanApiService: LoanApiService,
    private toaster: ToastsManager,
    private alertify: AlertifyService, public loanapi: LoanApiService) {


    // this.components = { numericCellEditor: getNumericCellEditor() };
    // this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    // this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };

    // this.columnDefs = [
    //   { headerName: 'Name', field: 'Assoc_Name', cellClass: 'editable-color', editable: true, width: 150 },
    //   { headerName: 'Title', field: 'Contact', cellClass: 'editable-color', editable: true, width: 150 },
    //   { headerName: 'Location', field: 'Location', cellClass: 'editable-color', editable: true, width: 150 },
    //   { headerName: 'Phone', field: 'Phone', cellClass: 'editable-color', editable: true, width: 150 },
    //   { headerName: 'Email', field: 'Email', cellClass: 'editable-color', editable: true, width: 150 },
    //   {
    //     headerName: 'Co Borrower', field: 'Is_CoBorrower', cellClass: 'editable-color', editable: true, width: 100, cellEditor: "selectEditor",
    //     cellEditorParams: { values: [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }] },
    //     valueFormatter: function (params) {
    //       return params.value == 1 ? 'Yes' : 'No';
    //     }
    //   },
    //   { headerName: '', field: '', cellRenderer: "deletecolumn" },


    // ];

    // this.context = { componentParent: this };

  }

  ngOnInit() {


    if (this.mode === 'create') {
      this.createForm({});
    }
    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobj) {
      
      
        if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0]) {
          this.createForm(this.localloanobj.LoanMaster[0]);
          this.loan_id = this.localloanobj.LoanMaster[0].Loan_ID;
        }
      
      this.stateList = this.localstorageservice.retrieve(environment.referencedatakey).StateList;
      // if (this.borrowerInfoForm.value.Co_Borrower_ID) {
      //   this.rowData = [];
      //   this.rowData = this.localloanobj.Association !== null ? this.localloanobj.Association.filter(as => { return as.ActionStatus !== 3 && as.Assoc_Type_Code == this.borrowerInfoForm.value.Co_Borrower_ID; }) : [];
      // }
    }

    // this.localstorageservice.observe(environment.loankey).subscribe(res => {
      
    //   if (res) {

    //     // if(this.localloanobj){
    //     //   this.initialize();
    //     // }
    //     this.localloanobj = res;
    //     //borrower info
    //     if (this.localloanobj.srccomponentedit == "BorrowerInfoComponent") {

    //       this.rowData[this.localloanobj.lasteditrowindex] = this.localloanobj.Association.find(as => { return as.ActionStatus !== 3 && as == this.latestUpdatedObject });
    //     } else {

    //       this.rowData = [];
    //       this.rowData = this.localloanobj.Association !== null ? this.localloanobj.Association.filter(as => { return as.ActionStatus !== 3 && as.Assoc_Type_Code == this.borrowerInfoForm.value.Co_Borrower_ID }) : [];

    //     }
    //     this.localloanobj.srccomponentedit = undefined;
    //     this.localloanobj.lasteditrowindex = undefined;
    //     this.latestUpdatedObject = undefined;
    //   }

    // });


  }

  getTypeNameOfCB(cbTypeID){
    let entity = this.entityType.find(et=>et.key == cbTypeID);
    return entity ? entity.value : '';
  }
  createForm(formData) {
    console.log(formData)
    this.borrowerInfoForm = this.fb.group({
      Borrower_First_Name: [formData.Borrower_First_Name || '', Validators.required],
      Borrower_MI: [formData.Borrower_MI || ''],
      Borrower_Last_Name: [formData.Borrower_Last_Name || '', Validators.required],
      Borrower_SSN_Hash: [formData.Borrower_SSN_Hash || '', Validators.required],
      Co_Borrower_ID: [formData.Co_Borrower_ID || '', Validators.required],
      Borrower_Address: [formData.Borrower_Address || '', Validators.required],
      Borrower_City: [formData.Borrower_City || '', Validators.required],
      Borrower_State_ID: [formData.Borrower_State_ID || '', Validators.required],
      Borrower_Zip: [formData.Borrower_Zip || '', Validators.required],
      Borrower_Phone: [formData.Borrower_Phone || '', Validators.required],
      Borrower_email: [formData.Borrower_email || '', [Validators.required, Validators.email]],
      Borrower_DOB: [formData.Borrower_DOB ? this.formatDate(formData.Borrower_DOB) : '', Validators.required],
      Crop_Year : [formData.Crop_Year || (this.mode === 'create' ? (new Date()).getFullYear() : ''), Validators.required],
      Spouse_First_Name: [formData.Spouse_First_Name || ''],
      Spouse__MI: [formData.Spouse__MI || ''],
      Spouse_Last_name: [formData.Spouse_Last_name || ''],
      Spouse_Phone: [formData.Spouse_Phone || ''],
      Spouse_Email: [formData.Spouse_Email || ''],

    })
    if(this.associationTypeCodes.indexOf(formData.Co_Borrower_ID)>-1){
      this.selectedAssociaionTypeCode =  formData.Co_Borrower_ID;
    }
    
    this.borrowerInfoForm.valueChanges.forEach(
      (value: any) => {
        this.isSubmitted = false;
        if (this.mode === 'create') {
          this.onFormValueChange.emit({ value: value, valid: this.borrowerInfoForm.valid, successCallback: this.savedByparentSuccessssCallback });
        } else {
          this.localloanobj.LoanMaster[0] = Object.assign(this.localloanobj.LoanMaster[0], value);
          this.loanserviceworker.performcalculationonloanobject(this.localloanobj);
        }
      }
    );
  }


  savedByparentSuccessssCallback = () => {
    this.createForm({});
  }

  formatDate(strDate) {
    if (strDate) {
      var date = new Date(strDate);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    } else {
      return '';
    }
  }

  onEntityTypeChange(data) {
    
    let entities = this.associationTypeCodes.slice(0); //clone
    let valueIndex = entities.indexOf(data.value);
    if(valueIndex >-1){
      entities.splice(valueIndex,1);
      let existingAssociations = this.localloanobj.Association.filter(as=> entities.indexOf(as.Assoc_Type_Code) > -1 );
      existingAssociations.forEach(assoc => {
        assoc.Assoc_Type_Code = data.value;
        assoc.ActionStatus = assoc.ActionStatus || 2;
      });
      this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
      this.selectedAssociaionTypeCode = data.value;
    }
  }

  synctoDb() {
    // if (this.borrowerInfoForm.valid) {
    //   this.loanApiService.syncloanborrower(this.loan_id, this.borrowerInfoForm.value as loan_borrower).subscribe((successResponse) => {
    //     this.toaster.success("Borrower details saved successfully");
    //     this.isSubmitted = true;
    //   }, (errorResponse) => {
    //     this.toaster.error("Error Occurered while saving borrower details");

    //   });
    // } else {
    //   this.toaster.error("Borrower details form doesn't seem to have data in correct format, please correct them before saving.");
    // }

    let loanMaster = this.localloanobj.LoanMaster[0];
    loanMaster.Borrower_First_Name = this.borrowerInfoForm.value.Borrower_First_Name;
    loanMaster.Borrower_MI = this.borrowerInfoForm.value.Borrower_MI;
    loanMaster.Borrower_Last_Name = this.borrowerInfoForm.value.Borrower_Last_Name;
    loanMaster.Borrower_SSN_Hash = this.borrowerInfoForm.value.Borrower_SSN_Hash;
    loanMaster.Co_Borrower_ID = this.borrowerInfoForm.value.Co_Borrower_ID;
    loanMaster.Borrower_Address = this.borrowerInfoForm.value.Borrower_Address;
    loanMaster.Borrower_City = this.borrowerInfoForm.value.Borrower_First_Name;
    loanMaster.Borrower_State_ID = this.borrowerInfoForm.value.Borrower_State_ID;
    loanMaster.Borrower_Zip = this.borrowerInfoForm.value.Borrower_Zip;
    loanMaster.Borrower_Phone = this.borrowerInfoForm.value.Borrower_Phone;
    loanMaster.Borrower_email = this.borrowerInfoForm.value.Borrower_email;
    loanMaster.Borrower_DOB = this.borrowerInfoForm.value.Borrower_DOB;
    loanMaster.Spouse_First_Name = this.borrowerInfoForm.value.Spouse_First_Name;
    loanMaster.Spouse__MI = this.borrowerInfoForm.value.Spouse__MI;
    loanMaster.Spouse_Last_name = this.borrowerInfoForm.value.Spouse_Last_name;
    loanMaster.Spouse_Phone = this.borrowerInfoForm.value.Spouse_Phone;
    loanMaster.Spouse_Email = this.borrowerInfoForm.value.Spouse_Email;
    this.loanapi.syncloanobject(this.localloanobj).subscribe(res => {
      if (res.ResCode == 1) {
        this.loanapi.getLoanById(this.localloanobj.Loan_Full_ID).subscribe(res => {
          this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
          if (res.ResCode == 1) {
            this.toaster.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else {
            this.toaster.error("Could not fetch Loan Object from API")
          }
        });
      }
      else {
        this.toaster.error("Error in Sync");
      }
    });
  }

  // addrow() {


  //   //TODO: Workaround of not refreshing rowData issue, otherwise not required
  //   let tempRowData = this.rowData;
  //   this.rowData = [];
  //   tempRowData.forEach(element => {
  //     this.rowData.push(element);
  //   })

  //   let newAssocialtion = new Loan_Association();
  //   this.rowData.push(newAssocialtion);

  // }

  // rowvaluechanged(value) {
  //   let data: Loan_Association = value.data;
  //   if (data.Assoc_ID == undefined) {
  //     data.Assoc_ID = 0;
  //     data.ActionStatus = 1;
  //     data.Assoc_Type_Code = this.borrowerInfoForm.value.Co_Borrower_ID;
  //     data.Loan_Full_ID = this.localloanobj.Loan_Full_ID;
  //     this.localloanobj.Association.push(data);

  //   } else if (data.Assoc_ID > 0) {
  //     data.ActionStatus = 2;
  //   }

  //   this.localloanobj.srccomponentedit = "BorrowerInfoComponent";
  //   this.localloanobj.lasteditrowindex = value.rowIndex;
  //   this.latestUpdatedObject = data;
  //   this.loanserviceworker.performcalculationonloanobject(this.localloanobj);
  // }

  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.columnApi = params.columnApi;

  // }

  // onGridSizeChanged(Event: any) {
  //   this.gridApi.sizeColumnsToFit();
  // }


  // DeleteClicked(rowIndex: any) {
  //   this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
  //     if (res == true) {
  //       let association: Loan_Association = this.rowData[rowIndex];

  //       this.rowData.splice(rowIndex, 1);

  //       if (association.Assoc_ID == 0) {
  //         //Newly added, altered, stored in local db but Assoc_ID = 0
  //         let localIndex = this.localloanobj.Association.findIndex(as => as == association);
  //         if (localIndex >= 0) {
  //           this.localloanobj.Association.splice(localIndex, 1);
  //         }
  //       } else if (association.Assoc_ID > 0) {
  //         //already exist in db and have some proper Assoc_ID
  //         let localObj = this.localloanobj.Association.find(as => as.Assoc_ID == association.Assoc_ID);
  //         localObj.ActionStatus = 3;

  //       }
  //       this.loanserviceworker.performcalculationonloanobject(this.localloanobj);
  //     }
  //   })
  // }

}
