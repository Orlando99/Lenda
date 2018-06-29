import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersComponent } from './others.component';

describe('RebatorComponent', () => {
  let component: OthersComponent;
  let fixture: ComponentFixture<OthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
