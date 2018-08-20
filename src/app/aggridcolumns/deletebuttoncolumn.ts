import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'child-cell',
    template: `
    <span>
      <i (click)="invokeParentMethod()" class="material-icons grid-action ag-grid-delete">
        delete
      </i>
    </span>`,
    styles: [
        `.btn {
            line-height: 0.1
        }`
    ]
})


export class DeleteButtonRenderer implements ICellRendererAngularComp {
    public params: any;

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
