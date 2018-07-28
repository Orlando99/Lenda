import { Component, OnInit } from '@angular/core';
import { FsaService } from './fsa/fsa.service';
import { LiveStockService } from './livestock/livestock.service';

@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.scss'],
  providers: [FsaService, LiveStockService]
})
export class CollateralComponent implements OnInit {
  public pageSettings = {
    lineHolder: {
      isActive: true,
      isDisabled: true
    },
    buyer: {
      isActive: true,
      isDisabled: true
    },
    guarantor: {
      isActive: true,
      isDisabled: true
    },
    fsa: {
      isActive: true,
      isDisabled: true
    },
    livestock: {
      isActive: false,
      isDisabled: false
    },
    storedCrop: {
      isActive: false,
      isDisabled: false
    },
    equipment: {
      isActive: false,
      isDisabled: false
    },
    realestate: {
      isActive: false,
      isDisabled: false
    },
    other: {
      isActive: false,
      isDisabled: false
    },
    contacts: {
      isActive: true,
      isDisabled: true
    },
    crossCollateral: {
      isActive: true,
      isDisabled: true
    }
  };

  constructor() { }

  ngOnInit() {
  }
}

