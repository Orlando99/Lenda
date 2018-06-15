import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerAssociationComponent } from './buyer-association.component';

describe('BuyerAssociationComponent', () => {
  let component: BuyerAssociationComponent;
  let fixture: ComponentFixture<BuyerAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
