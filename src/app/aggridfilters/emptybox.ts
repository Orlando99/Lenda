
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";
import { isNumber } from "util";

@Component({
    selector: 'Empty-cell',
    template: `
    <div #container fxLayout="row" class="grayedcell">
    </div>
    `
})
export class EmptyEditor implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public selectedValue:any;
    public values=[];
    public value=0;
    public style={};
    @ViewChild('container', {read: ViewContainerRef}) public container;

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        
        // setTimeout(() => {
        //     this.container.element.nativeElement.focus();
        // })
    }

    agInit(params: any): void {
    debugger
        this.params = params;
        
        // this.values=params.values;
        // if(isNumber(params.value))
        // this.selectedValue=parseInt(params.value);
        // else
        // this.selectedValue=params.value;

        // this.style = {
           
        //     width: params.eGridCell.offsetWidth.toString() +"px",
        //     height: params.eGridCell.offsetHeight.toString() +"px",
           
        //   };
    }

    getValue(): any {
    //    return this.selectedValue;

    }

    isPopup(): boolean {
        return false;
    }
}
