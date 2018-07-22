import { Component, OnInit } from '@angular/core';
import { CollateralService } from './collateral.service';

@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.scss'],
  providers: [CollateralService]
})
export class CollateralComponent implements OnInit {
  constructor(
    public collateralService: CollateralService
  ) { }

  ngOnInit() {
  }
}
