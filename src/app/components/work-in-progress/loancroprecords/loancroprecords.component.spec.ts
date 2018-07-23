import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCropsRecordsComponent } from './loancroprecords.component';

describe('CropunitrecordsComponent', () => {
  let component: LoanCropsRecordsComponent;
  let fixture: ComponentFixture<LoanCropsRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanCropsRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCropsRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
