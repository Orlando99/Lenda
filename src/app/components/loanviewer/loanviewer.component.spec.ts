import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanviewerComponent } from './loanviewer.component';

describe('LoanviewerComponent', () => {
  let component: LoanviewerComponent;
  let fixture: ComponentFixture<LoanviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
