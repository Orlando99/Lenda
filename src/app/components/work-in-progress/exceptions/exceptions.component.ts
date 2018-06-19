import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.scss']
})
export class ExceptionsComponent implements OnInit {

  @Input('exceptionList')
  exceptionList : Array<any>;
  
  constructor() { }

  ngOnInit() {
  }

}
