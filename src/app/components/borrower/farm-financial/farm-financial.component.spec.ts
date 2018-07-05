import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmFinancialComponent } from './farm-financial.component';

describe('FarmFinancialComponent', () => {
  let component: FarmFinancialComponent;
  let fixture: ComponentFixture<FarmFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmFinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
