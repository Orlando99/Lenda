import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterComponent } from './master.component';
import { HeaderComponent } from '../shared/layout/header.component';
import { FooterComponent } from '../shared/layout/footer.component';
import { RouterModule, Router, ActivatedRoute, ChildrenOutletContexts } from '@angular/router';
import { MatMenuModule, MatIconModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { LocalStorageService } from '../services/localstorage.service';
import { GlobalService } from '../services/global.service';
import { LocalBase } from '../shared/localbase';
import { FilterJson } from '../shared/filterjson';
import { TranslateService, TranslateModule, TranslateFakeLoader, TranslateLoader } from '@ngx-translate/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

class RouterStub {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;
 
describe('MasterComponent', () => {
  let component: MasterComponent;
  let fixture: ComponentFixture<MasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterComponent, HeaderComponent, FooterComponent ],
      imports : [
        RouterModule,
        MatMenuModule,
        MatIconModule,
        MatSelectModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers : [
        LocalStorageService,
        { 
          provide: Router, 
          useClass: RouterStub 
        },
        {
          provide: ActivatedRoute, 
          useValue: fakeActivatedRoute
        },
        GlobalService,
        LocalBase,
        FilterJson,
        TranslateService,
        ChildrenOutletContexts
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
