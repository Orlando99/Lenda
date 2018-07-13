import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentChartComponent } from './commitment-chart.component';

describe('CommitmentChartComponent', () => {
  let component: CommitmentChartComponent;
  let fixture: ComponentFixture<CommitmentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitmentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
