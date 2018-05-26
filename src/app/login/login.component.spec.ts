import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LoginComponent } from './login.component';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';
import { JwtService } from '../services/jwt.service';
import { Http, ConnectionBackend, HttpModule } from '@angular/http';
import { ToastsManager, ToastOptions } from 'ng2-toastr';
import { LocalStorageService } from '../services/localstorage.service'; 
import { LocalBase } from '../shared/localbase';
import { AlertifyService } from '../alertify/alertify.service';
import { MatDialog, MatDialogModule } from '@angular/material';
import { Overlay, ScrollStrategyOptions, ScrollDispatcher, OverlayModule } from '@angular/cdk/overlay';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de:  DebugElement;
  let el:  HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports : [
        FormsModule,
        HttpModule,
        OverlayModule,
        MatDialogModule
      ],
      providers : [
        {
          provide: ActivatedRoute, 
          useValue: fakeActivatedRoute
        },
        { 
          provide: Router, 
          useClass: class { navigate = jasmine.createSpy("navigate"); }
        },
        UserService,
        ApiService,
        Http,
        ConnectionBackend,
        JwtService,
        ToastsManager,
        ToastOptions,
        LocalStorageService,
        FormBuilder,
        LocalBase,
        AlertifyService,
        MatDialog,
        Overlay,
        ScrollStrategyOptions,
        ScrollDispatcher,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
     // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
