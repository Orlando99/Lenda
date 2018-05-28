import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr';
import "reflect-metadata";

//START MATERIAL COMPONENTS 
import { MatButtonModule, MatCheckboxModule, MatNativeDateModule, MAT_DATE_LOCALE, MatProgressSpinner, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule, MatSnackBarModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

//ENDS MATERIAL COMPONENTS

//START SERVICES 
import { LocalStorageService } from 'ngx-webstorage';
import { GlobalService, ApiService } from './services';
import { SharedModule } from './shared/shared.module';
import { AlertifyService } from './alertify/alertify.service';
import { LoanApiService } from './services/loan/loanapi.service';
//END SERVICES 



//START COMPONENTS 
import { AppComponent } from './app.component';
import { AlertComponent, ConfirmComponent } from './alertify/components'
import { HeaderComponent } from './shared/layout/header.component';
import { FooterComponent } from './shared/layout/footer.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MasterComponent } from "./master/master.component";
import { SummaryComponent } from './components/summary/summary.component';
import { LoanListComponent } from "./components/loan-list/loan-list.component";
import { LoanOverviewComponent } from './components/loan-overview/loan-overview.component';
import { FinancialsComponent } from './components/summary/financials/financials.component';
import { Borrowercalculationworker } from './Workers/calculations/borrowercalculationworker.service';
import { LoancalculationWorker } from './Workers/calculations/loancalculationworker';
import { BorrowerComponent } from './components/borrower/borrower.component';
import { BalancesheetComponent } from './components/borrower/balancesheet/balancesheet.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    DashboardComponent,
    MasterComponent,
    AlertComponent,
    ConfirmComponent,
    FooterComponent,
    HeaderComponent,
    SummaryComponent,
    LoanListComponent,
    LoanOverviewComponent,
    FinancialsComponent,
    BorrowerComponent,
    BalancesheetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatGridListModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    ToastModule.forRoot()
  ],
  exports: [
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    MatListModule,
    MatTableModule,
    MatGridListModule,
    MatExpansionModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatButtonToggleModule,
  ],
  providers: [
    LocalStorageService,
    GlobalService,
    MatDialogModule,
    AlertifyService,
    LoanApiService,
    ApiService,
    Borrowercalculationworker,
    LoancalculationWorker
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
