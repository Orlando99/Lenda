import { Directive, ElementRef, Renderer } from '@angular/core';

// Directive decorator
@Directive({ selector: '[setfocus]' })
// Directive class
export class FocusDirective {
    element:ElementRef;
    constructor(el: ElementRef, renderer: Renderer) {
     // Use renderer to render the element with styles
     this.element=el;
     el.nativeElement.focus();
    }

    
    ngAfterViewInit() {
        this.element.nativeElement.focus();
      }
}