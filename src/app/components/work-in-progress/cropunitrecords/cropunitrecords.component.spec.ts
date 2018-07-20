import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropunitrecordsComponent } from './cropunitrecords.component';

describe('CropunitrecordsComponent', () => {
  let component: CropunitrecordsComponent;
  let fixture: ComponentFixture<CropunitrecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropunitrecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropunitrecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
