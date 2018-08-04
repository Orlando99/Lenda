import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerRatingComponent } from './borrower-rating.component';

describe('BorrowerRatingComponent', () => {
  let component: BorrowerRatingComponent;
  let fixture: ComponentFixture<BorrowerRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
