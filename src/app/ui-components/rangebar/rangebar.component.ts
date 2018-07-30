import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { SvgTooltipService } from './../svg-tooltip/svg-tooltip.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-rangebar',
  templateUrl: './rangebar.component.html',
  styleUrls: ['./rangebar.component.scss'],
  providers: [SvgTooltipService]
})
export class RangebarComponent implements OnInit {
  @Input() strong;
  @Input() stable;
  @Input() weak;
  @Input() value = 0;
  public valuePercent;
  constructor(
    public svgTooltipService: SvgTooltipService,
    public elRef: ElementRef
  ) { }

  ngOnInit() {
    this.calculateValuePercentage();
  }

  ngAfterViewInit() {
    this.svgTooltipService.initTooltip(this.elRef.nativeElement.querySelectorAll('.main-value'), 'range');
  }

  calculateValuePercentage() {
    this.valuePercent = `${this.value * 100 / Math.abs(this.strong - this.weak)}%`;
  }
}
