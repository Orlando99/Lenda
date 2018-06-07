import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes, RouterLink, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AppComponent } from "./app.component";
import { MasterComponent } from "./master/master.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SummaryComponent } from "./components/summary/summary.component";
import { LoanListComponent } from "./components/loan-list/loan-list.component";
import { LoanOverviewComponent } from "./components/loan-overview/loan-overview.component";
import { BorrowerComponent } from "./components/borrower/borrower.component";
import { CropComponent } from "./components/crop/crop.component";

import { AdminComponent } from "./components/admin/admin.component";
import { NamingConventionComponent } from "./components/naming-convention/naming-convention.component";
import { FarmComponent } from "./components/farm/farm.component";
import { BudgetComponent } from "./components/budget/budget.component";

const appRoutes: Routes = [

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home', component: MasterComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'loans', component: LoanListComponent },
      { path: 'loanoverview/:id', component: LoanOverviewComponent,children:[
        { path: 'summary', component: SummaryComponent },
        { path: 'borrower', component: BorrowerComponent },
        { path: 'crop', component: CropComponent },
        { path: 'farm', component: FarmComponent },
        { path: 'budget', component: BudgetComponent }
      ] },
    ]
  },
  {
    path: 'home', component: MasterComponent,
    children: [
     
      { path: 'admin', component: AdminComponent, children:[
         { path: 'namingconvention', component: NamingConventionComponent },
      ] },
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
