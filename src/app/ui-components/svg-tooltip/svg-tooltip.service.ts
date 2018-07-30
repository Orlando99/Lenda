import { Injectable, ElementRef, Renderer2, Input } from '@angular/core';

/**
 * Shared service for collateral
 */
@Injectable()
export class SvgTooltipService {
  private textElements = [];
  private lineBreaks = [];
  private isDirty;
  private type;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  initTooltip(targetElements, type) {
    this.type = type;

    for (let icon of targetElements) {
      // Mouseenter event for tooltip
      icon.addEventListener('mouseover', (event) => {
        this.showTooltipText(event);
      });

      // Mouseleave event for tooltip
      icon.addEventListener('mouseleave', (event) => {
        this.removeTooltipText(event);
      });
    }
  }

  showTooltipText(event) {
    let tooltip = this.elRef.nativeElement.querySelector('.tooltip');
    // Flowchart specific
    // TODO: Move this out of this component
    // ===
    let hoverNodeId = event.target.parentNode.parentNode.id;
    let texts = this.getTooltipText(hoverNodeId);

    if (this.type === 'range') {
      texts = ['Current Value: <<value>>', 'Strong: << Strong value >>'];
    }
    // ===
    this.addTooltipNodes(tooltip, texts, event);
  }

  removeTooltipText(event) {
    let tooltip = this.elRef.nativeElement.querySelector('.tooltip');
    tooltip.querySelectorAll('div').forEach(function (node) {
      node.parentNode.removeChild(node);
    });
    this.renderer.removeClass(tooltip, 'active');
    this.isDirty = false;
  }

  getTooltipText(hoverNodeId) {
    // Hardcoded tooltip text for demo
    // TODO: Replace with dynamic logic once API is implemented
    if (hoverNodeId.indexOf('farmer') !== -1) {
      return ['Farmer 1 - 50', 'Farmer 2 - 160', 'Farmer 3 - 200'];
    } else if (hoverNodeId.indexOf('borrower') !== -1) {
      return ['Borrower 1 - 30', 'Borrower 2 - 60', 'Borrower 3 - 100'];
    } else if (hoverNodeId.indexOf('tree') !== -1) {
      return ['Crop 1 - 30', 'Crop 2 - 60', 'Crop 3 - 100', 'Crop 4 - 300'];
    } else {
      return ['Misc 1 - 30', 'Misc 2 - 60', 'Misc 3 - 100'];
    }
  }

  addTooltipNodes(tooltip, texts, event) {
    if (!this.isDirty) {
      this.textElements = [];
      this.lineBreaks = [];
      let parentElement = this.renderer.createElement('div');
      this.renderer.addClass(tooltip, 'active');
      this.renderer.setStyle(tooltip, 'left', event.pageX + 'px');
      for (let item of texts) {
        let text = this.renderer.createText(item);
        let lineBreak = this.renderer.createElement('br');
        this.textElements.push(text);

        this.lineBreaks.push(lineBreak);
        this.renderer.appendChild(parentElement, text);
        this.renderer.appendChild(
          parentElement,
          lineBreak
        );
        this.renderer.appendChild(tooltip, parentElement);
        this.renderer.setStyle(tooltip, 'height', 30 * this.textElements.length + 'px');
        this.renderer.setStyle(tooltip, 'top', event.pageY - (50 + 20 * this.textElements.length) + 'px');
      }
      this.isDirty = true;
    }
  }
}
