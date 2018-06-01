import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamingConventionComponent } from './naming-convention.component';

describe('NamingConventionComponent', () => {
  let component: NamingConventionComponent;
  let fixture: ComponentFixture<NamingConventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamingConventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamingConventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
