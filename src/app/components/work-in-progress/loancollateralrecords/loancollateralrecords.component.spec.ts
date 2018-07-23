import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCollateralRecordsComponent } from './loancollateralrecords.component';

describe('CropunitrecordsComponent', () => {
  let component: LoanCollateralRecordsComponent;
  let fixture: ComponentFixture<LoanCollateralRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanCollateralRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCollateralRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
