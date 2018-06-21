import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebatorComponent } from './rebator.component';

describe('RebatorComponent', () => {
  let component: RebatorComponent;
  let fixture: ComponentFixture<RebatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
