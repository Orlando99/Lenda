import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredCropComponent } from './storedcrop.component';

describe('RebatorComponent', () => {
  let component: StoredCropComponent;
  let fixture: ComponentFixture<StoredCropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredCropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
