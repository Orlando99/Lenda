import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'child-cell',
    template: `<span><button style="height: 16.5px" (click)="invokeParentMethod()" class="btn btn-info">{{btntext}}</button></span>`,
    styles: [
        `.btn {
            line-height: 0.1
        }`
    ]
})


export class DeleteButtonRenderer implements ICellRendererAngularComp {
    public params: any;
    public btntext:string="Delete"

    agInit(params: any): void {
        this.params = params;
    }

    public invokeParentMethod() {
        
        this.params.context.componentParent.DeleteClicked(this.params.rowIndex, this.params.data)
    }

    refresh(): boolean {
        return false;
    }
}