import { Component, OnInit } from '@angular/core';
import { CollateralService } from './collateral.service';
import { FsaService } from './fsa/fsa.service';
import { LiveStockService } from './livestock/livestock.service';

@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.scss'],
  providers: [CollateralService, FsaService, LiveStockService]
})
export class CollateralComponent implements OnInit {
  constructor(
    public collateralService: CollateralService
  ) { }

  ngOnInit() {
  }
}
