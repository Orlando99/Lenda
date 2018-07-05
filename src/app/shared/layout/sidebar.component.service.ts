import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidebarComponent } from '../layout/sidebar.component';
import { FlashCellsEvent } from 'ag-grid';

@Injectable()
export class SidebarService {
    private sidenav: MatSidenav;
    private mainHeader: HTMLElement;
    private mainContent: HTMLElement;
    private mainSideBar: HTMLElement;
    private mainLogo: HTMLElement;
    private minLogo: HTMLElement;

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public setHtmlElement(mainheader: HTMLElement, maincontent: HTMLElement,
        mainsidebar: HTMLElement, mainLogo: HTMLElement, minLogo: HTMLElement ) {
        this.mainHeader = mainheader;
        this.mainContent = maincontent;
        this.mainSideBar = mainsidebar;
        this.mainLogo = mainLogo;
        this.minLogo = minLogo;
    }

    public open() {
     this.sidenav.open();
    }


    public close() {
        this.sidenav.close();
    }

    public toggle(isExpanded: boolean): void {
        
       // this.mainHeader.style.marginLeft = isExpanded ? '215px' : '68px';
        this.mainContent.style.marginLeft = isExpanded ? '215px' : '68px';
        this.mainSideBar.style.width = isExpanded ? '215px' : '68px';
        if (isExpanded) {
            this.mainLogo.style.width = '215px';
        } else {
            this.minLogo.style.width = '68px';
        }
        this.sidenav.toggle();
    }
}
