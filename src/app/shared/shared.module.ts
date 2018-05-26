import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
//import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';



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
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
    ]
})
export class SharedModule { }
