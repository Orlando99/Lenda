import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ActivatedRoute } from '@angular/router'
import { LocalStorageService } from '../services/localstorage.service';
import { GlobalService } from '../services/global.service';
import { HttpClient } from '@angular/common/http';

import { MatInputModule } from '@angular/material'

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports : [
        MatInputModule
      ],
      providers : [
        {
          provide: ActivatedRoute, 
          useValue: fakeActivatedRoute
        },
        LocalStorageService,
        GlobalService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
