import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoBorrowerInfoComponent } from './co-borrower-info.component';

describe('CoBorrowerInfoComponent', () => {
  let component: CoBorrowerInfoComponent;
  let fixture: ComponentFixture<CoBorrowerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoBorrowerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoBorrowerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
