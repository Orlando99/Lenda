import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmsInfoComponent } from './farms-info.component';

describe('FarmsInfoComponent', () => {
  let component: FarmsInfoComponent;
  let fixture: ComponentFixture<FarmsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
