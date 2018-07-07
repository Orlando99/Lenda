import { Component, ViewContainerRef, HostListener } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LendaPlus';
  @HostListener('window:unload', ['$event'])
  public beforeunloadHandler($event) {

    //.loanstorage.clear("userid");
 }
  constructor(private toaster: ToastsManager,private router: Router, vcf: ViewContainerRef,private loanstorage:LocalStorageService) {
    this.toaster.setRootViewContainerRef(vcf);
    router.events.subscribe((res:any)=>{
      let url:string=res.url;
      if(url!=undefined){

      if(url.indexOf("login")!=-1){

      }
      else{
        let on=loanstorage.retrieve(environment.uid);
        if(on==null){
         router.navigateByUrl("login");
        }
      }

    }
    })

  }
}
