import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { NotificationFeedsComponent } from './notification-feeds.component';

@Injectable()
export class NotificationFeedsService {

    /**
     *
     */
    NotificationFeedsService() {
    }
    private sidenav: MatSidenav;

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public open() {
     this.sidenav.open();
    }


    public close() {
        this.sidenav.close();
    }

    public toggle(): void {

        this.sidenav.toggle();
    }
}
