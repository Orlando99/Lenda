import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell-value',
  templateUrl: './cell-value.component.html',
  styleUrls: ['./cell-value.component.scss']
})
export class CellValueComponent implements OnInit {
  @Input('bolderFont') bolderFont : boolean;
  @Input('borderRight') borderRight : boolean;
  @Input('valueType') valueType : ValueType;
  @Input('value') value : boolean;
  @Input('backgroundHighlight') backgroundHighlight : boolean;
  @Input('backgroundGreen') backgroundGreen : boolean;
  @Input('backgroundLightGreen') backgroundLightGreen : boolean;
  @Input('backgroundYellow') backgroundYellow : boolean;
  @Input('colorRed') colorRed : boolean;
  ValueType = ValueType;
  constructor() { }

  ngOnInit() {
  }

}
export enum ValueType{
  AMOUNT,
  PERCENTAGE
}
