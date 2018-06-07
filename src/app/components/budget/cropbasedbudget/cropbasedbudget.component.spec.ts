import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropbasedbudgetComponent } from './cropbasedbudget.component';

describe('CropbasedbudgetComponent', () => {
  let component: CropbasedbudgetComponent;
  let fixture: ComponentFixture<CropbasedbudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropbasedbudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropbasedbudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
