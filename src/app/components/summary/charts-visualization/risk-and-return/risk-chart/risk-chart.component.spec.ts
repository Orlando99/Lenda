import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskChartComponent } from './risk-chart.component';

describe('RiskChartComponent', () => {
  let component: RiskChartComponent;
  let fixture: ComponentFixture<RiskChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
