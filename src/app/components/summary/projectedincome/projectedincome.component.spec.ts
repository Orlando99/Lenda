import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectedincomeComponent } from './projectedincome.component';

describe('ProjectedincomeComponent', () => {
  let component: ProjectedincomeComponent;
  let fixture: ComponentFixture<ProjectedincomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectedincomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectedincomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
