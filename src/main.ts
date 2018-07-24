import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment.prod';
import {LicenseManager} from "ag-grid-enterprise";

import 'hammerjs';
LicenseManager.setLicenseKey("Evaluation_License_Valid_Until__9_September_2018__MTUzNjQ0NzYwMDAwMA==712c48d48d0a3ec85f3243b1295999ec");

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
