import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";

@Component({
    selector: 'boolean-cell',
    template: `<select  #input  [(ngModel)]="value" style="width: 100%; height: 100%;">
    <option value="1">Yes</option>
    <option value="2">No</option>
  </select>`
})
export class BooleanEditor implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public value: number;
    private cancelBeforeStart: boolean = false;

    @ViewChild('input', {read: ViewContainerRef}) public input;


    agInit(params: any): void {

        this.params = params;
        this.value = this.params.value;
    }

    getValue(): any {
        return this.value;
    }
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

  
}
