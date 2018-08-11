import { ErrorHandler, Inject, Injector, Injectable, ViewContainerRef } from '@angular/core';
import { ToasterService } from './toaster.service';
import { environment } from '../../environments/environment';
import { LoggingService } from './Logs/logging.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Logs } from '../models/loanmodel';
import { inject } from '@angular/core/src/render3';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector,@Inject(DOCUMENT) private document:Document) {
    // The true paramter tells Angular to rethrow exceptions, so operations like 'bootstrap' will result in an error
    // when an error happens. If we do not rethrow, bootstrap will always succeed.
    super();
  }

  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
  private get toasterService(): ToasterService {
    return this.injector.get(ToasterService);
  }

  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
  private get LoggingService(): LoggingService {
    return this.injector.get(LoggingService);
  }
  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
  private get localstorageService(): LocalStorageService {
    return this.injector.get(LocalStorageService);
  } 

  handleError(error) {
    if (environment.isDebugModeActive) {
      console.log('==== Error handled by Global Error Handler ===');
      
      let parts=this.document.location.href.split('/');
      this.toasterService.error(error.message);
      let userid = this.localstorageService.retrieve(environment.uid);
       let obj = new Logs();
        obj.Log_Id = 0;
        obj.Log_Message = error.message;
        obj.Loan_Full_ID=this.localstorageService.retrieve(environment.loanidkey);
        obj.Log_Section = "";
        obj.userID = userid;
        obj.SourceDetail=parts[2];
        obj.Log_Section=parts[parts.length-1];
        obj.SourceName="FrontEnd";
        this.LoggingService.createlog(obj).subscribe(res=>{
          
        })
    }
    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }
}
