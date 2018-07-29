import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangebarComponent } from './rangebar.component';

describe('RangebarComponent', () => {
  let component: RangebarComponent;
  let fixture: ComponentFixture<RangebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
