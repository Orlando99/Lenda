import { Component, OnInit, Input } from '@angular/core';
import { isNumber } from 'util';

@Component({
  selector: 'app-sub-table',
  templateUrl: './sub-table.component.html',
  styleUrls: ['./sub-table.component.scss']
})
export class SubTableComponent implements OnInit {

  constructor() { }

  @Input('rowTable')
  rowTable : Array<any>;

  @Input('highlightLastRow')
  highlightLastRow : boolean;

  ngOnInit() {

    console.log(this.rowTable);
  }
  isNumeric(val){
    return isNumber(val);
  }
}
