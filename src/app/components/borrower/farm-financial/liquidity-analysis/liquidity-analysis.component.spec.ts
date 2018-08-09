import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityAnalysisComponent } from './liquidity-analysis.component';

describe('LiquidityAnalysisComponent', () => {
  let component: LiquidityAnalysisComponent;
  let fixture: ComponentFixture<LiquidityAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidityAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
