
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";
import { isNumber } from "util";

@Component({
    selector: 'editor-cell',
    template: `
    <div fxLayout="row" class="grid-actions">
    <select (change)="change($event.target.value)" [value]="selectedValue">
      <option *ngFor="let value of values" [value]="value.key">{{value.value}}</option>
  </select>
  </div>
    `
})
export class SelectEditor implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public selectedValue:any;
    public values=[];
    @ViewChild('container', {read: ViewContainerRef}) public container;

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        debugger
        // setTimeout(() => {
        //     this.container.element.nativeElement.focus();
        // })
    }

    agInit(params: any): void {
        debugger
        this.params = params;
        this.values=params.values;
        if(isNumber(params.value))
        this.selectedValue=parseInt(params.value);
        else
        this.selectedValue=params.value;
    }

    getValue(): any {
       return this.selectedValue;
        
    }

    isPopup(): boolean {
        debugger
        return true;
    }

    change(event:any){
        this.selectedValue=event;
        try{
            this.params.context.componentParent.valuechanged(event,this.params.column.colId,this.params.rowIndex)
        }
        catch{

        }
    }

    onClick(happy: boolean) {
        debugger
        this.params.api.stopEditing();
    }

    onKeyDown(event): void {
        debugger
        let key = event.which || event.keyCode;
        if (key == 37 ||  // left
            key == 39) {  // right
            event.stopPropagation();
        }
    }
}