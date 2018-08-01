import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldReportComponent } from './yield-report.component';

describe('YieldReportComponent', () => {
  let component: YieldReportComponent;
  let fixture: ComponentFixture<YieldReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
