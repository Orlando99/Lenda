import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralReportComponent } from './collateral-report.component';

describe('CollateralReportComponent', () => {
  let component: CollateralReportComponent;
  let fixture: ComponentFixture<CollateralReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
