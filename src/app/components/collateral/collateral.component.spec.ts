import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralComponent } from './collateral.component';

describe('CropComponent', () => {
  let component: CollateralComponent;
  let fixture: ComponentFixture<CollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
