import { Component, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LendaPlus';
  
  constructor(private toaster: ToastsManager, vcf: ViewContainerRef) {
    this.toaster.setRootViewContainerRef(vcf);
  }
}
