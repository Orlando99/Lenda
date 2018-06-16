import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanbudgetGroupComponent } from './loanbudgetgroup.component';

describe('LoanbudgetGroupComponent', () => {
  let component: LoanbudgetGroupComponent;
  let fixture: ComponentFixture<LoanbudgetGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoanbudgetGroupComponent ]
    })
    .compileComponents();
  }));
 
  beforeEach(() => {
    fixture = TestBed.createComponent(LoanbudgetGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
