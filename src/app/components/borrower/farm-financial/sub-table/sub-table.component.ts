import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { isNumber } from 'util';

@Component({
  selector: 'app-sub-table',
  templateUrl: './sub-table.component.html',
  styleUrls: ['./sub-table.component.scss']
})
export class SubTableComponent implements OnInit {

  constructor(
    public elRef: ElementRef
  ) { }

  @Input('rowTable')
  rowTable : Array<any>;

  ngOnInit() {

    console.log(this.rowTable);
  }
  isNumeric(val){
    return isNumber(val);
  }
}
