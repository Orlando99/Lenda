import { Component, OnInit } from '@angular/core';
import { FsaService } from './fsa/fsa.service';
import { LiveStockService } from './livestock/livestock.service';
import { FormControl } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import CollteralSettings from './collateral-types.model';
import { CollateralService } from './collateral.service';

@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.scss'],
  providers: [FsaService, LiveStockService, CollateralService]
})

export class CollateralComponent implements OnInit {
  categories: any = [];
  loanFullID: string;
  collateralRows: any = {};
  isSyncEnabled: boolean = false;

  // Default settings of collateral tables
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
    collaterlData: {
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

  constructor(
    private localstorageservice: LocalStorageService,
    public collateralService: CollateralService) {
    this.loanFullID = this.localstorageservice.retrieve(environment.loanidkey)
  }

  ngOnInit() {
    this.pageSettings = this.localstorageservice.retrieve(environment.collateralTables) || this.pageSettings;
    this.getCollateralTypeRows();
  }

  onToggleSettings(item) {
    item.isActive = !item.isActive;
    this.localstorageservice.store(environment.collateralTables, this.pageSettings);
  }

  getCollateralTypeRows() {
    for (let index in CollteralSettings) {
      let item = CollteralSettings[index];
      this.collateralRows[index] = this.getRowsForType(item.key, item.source, item.sourceKey);
    }
  }

  getRowsForType(type: string, src: string, srcType: string) {
    let items = this.localstorageservice.retrieve(environment.loankey)[src];
    if (!items) {
      return 0;
    }
    if (!srcType) {
      return items.length;
    }
    return items
      .filter(lc => {
        return lc[srcType] === type
      }).length;
  }

  enableSync(isEnabled) {
    this.isSyncEnabled = isEnabled;
  }

  synctoDb() {
    this.enableSync(false);
    this.collateralService.syncToDb(this.localstorageservice.retrieve(environment.loankey));
  }
}


