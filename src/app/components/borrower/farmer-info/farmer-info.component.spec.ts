import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerInfoComponent } from './farmer-info.component';

describe('FarmerInfoComponent', () => {
  let component: FarmerInfoComponent;
  let fixture: ComponentFixture<FarmerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
