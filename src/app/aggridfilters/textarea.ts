import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'child-cell',
    template: `<div style="max-width:250px;height:100px;margin:0px;"><p style="word-wrap:break-word">{{params.value}}</p></div>`,
   
})
export class AggridTxtAreaComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}