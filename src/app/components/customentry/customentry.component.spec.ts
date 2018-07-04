import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomentryComponent } from './customentry.component';

describe('CustomentryComponent', () => {
  let component: CustomentryComponent;
  let fixture: ComponentFixture<CustomentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
