import { Directive, Input, OnChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPercentage]'
})
export class PercentageDirective  implements OnChanges{

  @Input('appPercentage') appPercentage : any;
  constructor(private el : ElementRef) {
   }

  ngOnChanges(){
    this.el.nativeElement.innerHTML = `<span>${this.appPercentage + '%'}</span>` ;
  }
}