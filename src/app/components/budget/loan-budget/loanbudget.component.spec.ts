import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanbudgetComponent } from './loanbudget.component';

describe('LoanbudgetComponent', () => {
  let component: LoanbudgetComponent;
  let fixture: ComponentFixture<LoanbudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoanbudgetComponent ]
    })
    .compileComponents();
  }));
 
  beforeEach(() => {
    fixture = TestBed.createComponent(LoanbudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
