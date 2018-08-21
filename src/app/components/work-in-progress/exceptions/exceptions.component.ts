import { Component, OnInit, Input } from '@angular/core';
import { ExceptionModel } from '../../../models/commonmodels';
import { environment } from '../../../../environments/environment.prod';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.scss']
})
export class ExceptionsComponent implements OnInit {

 
  localExceptionLogs : Array<ExceptionModel>;
  
  constructor(private localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.localExceptionLogs = this.localStorageService.retrieve(environment.exceptionStorageKey);

  }

}
