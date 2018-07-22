import { ErrorHandler, Inject, Injector, Injectable, ViewContainerRef } from '@angular/core';
import { ToasterService } from './toaster.service';
import { environment } from '../../environments/environment';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector) {
    // The true paramter tells Angular to rethrow exceptions, so operations like 'bootstrap' will result in an error
    // when an error happens. If we do not rethrow, bootstrap will always succeed.
    super();
  }

  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
  private get toasterService(): ToasterService {
    return this.injector.get(ToasterService);
  }

  handleError(error) {
    if (environment.isDebugModeActive) {
      console.log('==== Error handled by Global Error Handler ===');
      this.toasterService.error(error.message);
    }
    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }
}
