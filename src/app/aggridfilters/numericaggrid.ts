import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";

@Component({
    selector: 'numeric-cell',
    template: `<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value" style="width: 100%; height: 100%;">`
})
export class NumericEditor implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public value: number;
    private cancelBeforeStart: boolean = false;
    private acceptsdecimals:boolean=false;
    private decimalscount:number=0;
    @ViewChild('input', {read: ViewContainerRef}) public input;


    agInit(params: any): void {
         
        this.params = params;
        this.value = parseFloat(this.params.value);
        if(this.params.decimals!=undefined){
            this.acceptsdecimals=true;
            this.decimalscount=this.params.decimals;
        }
    

        // only start edit if key pressed is a number, not a letter
        this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
    }

    getValue(): any {
        if(this.acceptsdecimals)
        return parseFloat(this.value.toString()).toFixed(this.decimalscount);
        else
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd(): boolean {
         
        return this.value > 100000000000;
    };

    onKeyDown(event): void {
        if (!this.isKeyPressedNumeric(event)) {
            if (event.preventDefault) event.preventDefault();
        }
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

    private getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }

    private isCharNumeric(charStr): boolean {
        if(charStr=="Backspace"){
            return true;
        }
        if(this.acceptsdecimals && charStr=="." && !this.value.toString().includes("."))
        {
            return true;
        }
        return !!/\d/.test(charStr);
       
    }

    private isKeyPressedNumeric(event): boolean {
         
        const charCode = this.getCharCodeFromEvent(event);
        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        return this.isCharNumeric(charStr);
    }
}
