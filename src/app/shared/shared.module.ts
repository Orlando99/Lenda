import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
//import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { SpinerComponent } from './spiner/spiner.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        BrowserModule,
    ],
    declarations: [
    ],
    providers: [],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
    ]
})
export class SharedModule { }
