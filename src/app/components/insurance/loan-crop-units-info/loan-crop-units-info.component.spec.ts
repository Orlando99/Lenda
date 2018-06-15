import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCropUnitsInfoComponent } from './loan-crop-units-info.component';

describe('LoanCropUnitsInfoComponent', () => {
  let component: LoanCropUnitsInfoComponent;
  let fixture: ComponentFixture<LoanCropUnitsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanCropUnitsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCropUnitsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
