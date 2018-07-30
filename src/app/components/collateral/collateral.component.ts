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
  constructor() { }

  ngOnInit() {
  }
}

