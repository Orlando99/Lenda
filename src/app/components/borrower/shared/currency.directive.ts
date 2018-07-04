import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { isNumber } from 'util';

@Directive({
  selector: '[appCurrency]'
})
export class CurrencyDirective implements OnChanges{

  @Input('appCurrency') appCurrency : any;
  constructor(private el : ElementRef) {
   }

  ngOnChanges(){
    this.el.nativeElement.innerHTML = `<span style="float:left">$</span><span>${isNumber(this.appCurrency) ? new Intl.NumberFormat('en-US').format(this.appCurrency): this.appCurrency}</span>` ;
  }
}
