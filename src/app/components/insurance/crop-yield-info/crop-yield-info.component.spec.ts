import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropYieldInfoComponent } from './crop-yield-info.component';

describe('CropYieldInfoComponent', () => {
  let component: CropYieldInfoComponent;
  let fixture: ComponentFixture<CropYieldInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropYieldInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropYieldInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
