import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

@Injectable()
export class ToasterService {

  constructor(private toastr: ToastsManager, private toastOpts: ToastOptions) {
    // this.toastOpts.toastLife = 8000;
    // this.toastOpts.positionClass = 'toast-top-center';
    // this.toastOpts.showCloseButton = true;
  }

  success(message: string) {
    this.toastr.success(message);
  }

  info(message: string) {
    this.toastr.info(message);
  }

  warning(message: string) {
    this.toastr.warning(message);
  }

  error(message: string) {
    this.toastr.error(message);
  }
}
