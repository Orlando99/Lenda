import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanMarketingRecordsComponent } from './loanmarketingrecords.component';

describe('CropunitrecordsComponent', () => {
  let component: LoanMarketingRecordsComponent;
  let fixture: ComponentFixture<LoanMarketingRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanMarketingRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanMarketingRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
