import { Component, OnInit, Renderer2, ElementRef, Input } from '@angular/core';
import { SvgTooltipService } from './svg-tooltip.service';

@Component({
  selector: 'app-svg-tooltip',
  templateUrl: './svg-tooltip.component.html',
  styleUrls: ['./svg-tooltip.component.scss'],
  providers: [SvgTooltipService]
})
export class SvgTooltipComponent implements OnInit {
  @Input() elRef;

  constructor(
    private svgTooltipService: SvgTooltipService
  ) { }

  ngOnInit() {
  }
}
