import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-ag-grid-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AgGridTooltipComponent implements ICellRendererAngularComp {
    params: any;
    constructor(
    ){

    }

    agInit(params: any): void {
        this.params = params;
    }

    ngOnDestroy() {
    }

    
    mouseover(event) {
        //console.log(event);
        let nodes = this.params.api.getRenderedNodes();
        var rows = [];
        rows.push(this.params);

        this.params.api.refreshCells(this.params, this.params.api);
    }
    
    refresh(params: any): boolean {
        this.params = params;
        return true;
    }

}
