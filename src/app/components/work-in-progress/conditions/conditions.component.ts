import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent implements OnInit {
  @Input('conditionList')
  conditionList : Array<string>;
  constructor() { }

  ngOnInit() {
  }

}
