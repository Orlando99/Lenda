import {AfterViewInit, Component, ViewChild, ViewContainerRef, ElementRef, ViewChildren} from "@angular/core";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ICellEditorAngularComp} from "ag-grid-angular";
import { FormControl } from "@angular/forms";
import { MatChipInputEvent, MatAutocompleteSelectedEvent } from "@angular/material";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
    selector: 'chipseditor-cell',
    template: `
    <angular2-multiselect [data]="dropdownList" [(ngModel)]="selectedItems" 
    [settings]="dropdownSettings" 
    (onSelect)="onItemSelect($event)" 
    (onDeSelect)="OnItemDeSelect($event)"
    (onSelectAll)="onSelectAll($event)"
    (onDeSelectAll)="onDeSelectAll($event)">
</angular2-multiselect>

    `,
    styles:[`
    `]
})
export class ChipsListEditor implements ICellEditorAngularComp {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  context:any;
  params: any;
  ngOnInit(){
      // this.dropdownList = [
      //                     ];
      // this.selectedItems = [
      //                     ];
      this.dropdownSettings = { 
                                singleSelection: false, 
                                text:"Select Options",
                                selectAllText:'Select All',
                                unSelectAllText:'UnSelect All',
                                enableSearchFilter: true,
                                classes:"myclass custom-class"
                              };            
  }
  onItemSelect(item:any){
    //   this.context.chipitemsselected(this.selectedItems);
  }
  OnItemDeSelect(item:any){
      console.log(item);
     // this.context.chipitemsselected(this.selectedItems);
  }
  onSelectAll(items: any){
      console.log(items);
      //this.context.chipitemsselected(this.selectedItems);
  }
  onDeSelectAll(items: any){
      console.log(items);
      //this.context.chipitemsselected(this.selectedItems);
  }

    agInit(params: any): void {
      debugger
        this.params = params;
        this.context=this.params.context.componentParent;
        this.dropdownList=params.items;
        let values=params.value.toString().split(',');
        values.forEach(element => {
            let item=this.dropdownList.find(p=>p.itemName==element);
            if(item!=undefined){
                this.selectedItems.push(item);
            }
        });
    }

    getValue(): any {
      debugger
       return this.selectedItems.map(p=>p.itemName).join(",");
    }

    isPopup(): boolean {
        return true;
    }
}