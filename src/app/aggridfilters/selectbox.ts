
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";

@Component({
    selector: 'editor-cell',
    template: `
    <div fxLayout="row" class="grid-actions">
    <select [value]="selectedValue">
      <option *ngFor="let value of values" [value]="value.key">{{value.value}}</option>
  </select>
  </div>
    `
})
export class SelectEditor implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public selectedValue:number;
    public values=[];
    @ViewChild('container', {read: ViewContainerRef}) public container;

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        debugger
        setTimeout(() => {
            this.container.element.nativeElement.focus();
        })
    }

    agInit(params: any): void {
        debugger
        this.params = params;
        this.values=params.values;
        this.selectedValue=parseInt(params.value);
    }

    getValue(): any {
       return this.params.value;
        
    }

    isPopup(): boolean {
        debugger
        return true;
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