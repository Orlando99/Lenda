import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AphComponent } from './aph.component';

describe('AphComponent', () => {
  let component: AphComponent;
  let fixture: ComponentFixture<AphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
