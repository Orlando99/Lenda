import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FSAComponent } from './fsa.component';

describe('RebatorComponent', () => {
  let component: FSAComponent;
  let fixture: ComponentFixture<FSAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FSAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FSAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
