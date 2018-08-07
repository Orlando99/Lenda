import {AfterViewInit, Component, ViewChild, ViewContainerRef, ElementRef, ViewChildren, HostListener} from "@angular/core";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ICellEditorAngularComp} from "ag-grid-angular";
import { FormControl } from "@angular/forms";
import { MatChipInputEvent, MatAutocompleteSelectedEvent } from "@angular/material";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { NgSelectComponent } from "../../../node_modules/@ng-select/ng-select";

@Component({
    selector: 'chipseditor-cell',
    templateUrl: './chipscelleditor.html',
    styleUrls: ['./chipscelleditor.scss']
})
export class ChipsListEditor implements ICellEditorAngularComp {
    dropdownList = [];
    selectedItems = [];
    context:any;
    params: any;
    previousWidth = 0;
    @ViewChild('ngSelect') selectEL: NgSelectComponent;

    ngOnInit(){
        window.addEventListener('scroll', this.scroll, true);
    }
    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
    }

    ngAfterViewInit() {
        this.selectEL.focus();
        this.selectEL.open();
    }

    scroll = ():void => {
    };

    closeDropdown() { 
        this.params.stopEditing();
    }

    onClickedOutside(event) {
        // this.params.stopEditing();
    }    

    agInit(params: any): void {
        params.eGridCell.style.height = "auto";
        this.previousWidth = params.eGridCell.style.width;
        console.log(parseInt(this.previousWidth + ""));
        this.params = params;
        this.context = this.params.context.componentParent;
        this.dropdownList = params.items;
        if (params.value !== "") {
            this.selectedItems=params.value.toString().split(',');
        }

        if ( parseInt(this.previousWidth + "") < 300)  {
            params.eGridCell.style.width = "200px";
        }        
    }

    getValue(): any {
        this.params.eGridCell.style.width = this.previousWidth;

        if (this.selectedItems.length == 0) return "";
        return this.selectedItems.join(",");
    }

    isPopup(): boolean {
        return false;
    }

    changeAll(event){
        if (event.srcElement.checked) {
            this.selectedItems = this.dropdownList.map(p=>p.itemName);
        } else {
            this.selectedItems = [];
        }
    }
}