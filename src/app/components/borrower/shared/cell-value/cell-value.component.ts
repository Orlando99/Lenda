import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell-value',
  templateUrl: './cell-value.component.html',
  styleUrls: ['./cell-value.component.scss']
})
export class CellValueComponent implements OnInit {

  @Input('bolderFont') bolderFont : boolean;
  @Input('borderRight') borderRight : boolean;
  @Input('isAmount') isAmount : boolean;
  @Input('isPercentage') isPercentage : boolean;
  @Input('value') value : boolean;
  @Input('backgroundHighlight') backgroundHighlight : boolean;
  @Input('backgroundGreen') backgroundGreen : boolean; 
  @Input('colorRed') colorRed : boolean; 
  
  constructor() { }

  ngOnInit() {
  }

}
