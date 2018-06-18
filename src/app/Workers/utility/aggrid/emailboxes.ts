import {AfterViewInit, Component, ViewChild, ViewContainerRef, ElementRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";
import { FormControl } from "@angular/forms";

@Component({
    selector: 'numeric-cell',
    template: `<input [formControl]="EmailControl" type="email" [(ngModel)]="value" style="width: 100%">`
})
export class EmailEditor implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public value: number;
    EmailControl=new FormControl();
    @ViewChild('input') public input:ElementRef;


    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;
        this.EmailControl.valueChanges
        .debounceTime(400) 
        .distinctUntilChanged().subscribe(res=>{
            this.params.context.componentParent.isgriddirty=true;
        })
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd(): boolean {
        return false;
    };

    // onKeyDown(event): void {
    //     if (!this.isKeyPressedNumeric(event)) {
    //         if (event.preventDefault) event.preventDefault();
    //     }
    // }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
    }

  
}