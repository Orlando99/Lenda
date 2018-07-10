import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-risk-and-return',
  templateUrl: './risk-and-return.component.html',
  styleUrls: ['./risk-and-return.component.scss']
})
export class RiskAndReturnComponent implements OnInit {
  @Input() viewMode;
  constructor() { }

  ngOnInit() {
  }
}
