import { Component, ViewContainerRef, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import {
  Router, NavigationStart, NavigationCancel, NavigationEnd
} from '@angular/router';
import { environment } from '../environments/environment.prod';
import { LayoutService } from './shared/layout/layout.service';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [LayoutService, LoginService]
})
export class AppComponent implements OnInit, AfterViewInit {
  public loadingBarColor = '#2cbb9c';
  public isSidebarExpanded: boolean = true;
  public isUserLoggedIn;
  title = 'LendaPlus';
  loading;
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    //.loanstorage.clear("userid");
  }
  constructor(
    private toaster: ToastsManager,
    private router: Router,
    vcf: ViewContainerRef,
    private loanstorage: LocalStorageService,
    public layoutService: LayoutService,
    public loginService: LoginService) {

    this.toaster.setRootViewContainerRef(vcf);
    this.loading = true;

    router.events.subscribe((res: any) => {
      let url: string = res.url;
      if (url != undefined) {

        if (url.indexOf("login") != -1) {

        }
        else {
          let on = loanstorage.retrieve(environment.uid);
          if (on == null) {
            router.navigateByUrl("login");
          }
        }
      }
    })
  }

  ngOnInit() {
    this.layoutService.isSidebarExpanded().subscribe((value) => {
      this.isSidebarExpanded = value;
    });

    // is user logged-in
    this.loginService.isLoggedIn().subscribe((value) => {
      this.isUserLoggedIn = value;
    });
  }

  ngAfterViewInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        }
        else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      });
  }
}
