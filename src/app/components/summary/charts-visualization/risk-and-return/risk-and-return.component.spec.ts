import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAndReturnComponent } from './risk-and-return.component';

describe('RiskAndReturnComponent', () => {
  let component: RiskAndReturnComponent;
  let fixture: ComponentFixture<RiskAndReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAndReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAndReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
