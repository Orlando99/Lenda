import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmRecordsComponent } from './farmrecords.component';

describe('CropunitrecordsComponent', () => {
  let component: FarmRecordsComponent;
  let fixture: ComponentFixture<FarmRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
