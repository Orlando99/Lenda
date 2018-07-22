import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkInProgressStatsComponent } from './work-in-progress-stats.component';

describe('WorkInProgressStatsComponent', () => {
  let component: WorkInProgressStatsComponent;
  let fixture: ComponentFixture<WorkInProgressStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkInProgressStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkInProgressStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
