import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

import { environment } from '../../../environments/environment';
import { versions } from '../../versions';
import { ReferenceService } from '../../services/reference/reference.service';

@Component({
  selector: 'layout-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public apiurl = environment.apiUrl;
  public git = versions.revision;
  public databaseName: string = "";

  constructor(public localst: LocalStorageService,
  public referenceService: ReferenceService) { }

  ngOnInit() {
    this.getReferenceData();
  }

  getReferenceData() {
    this.referenceService.getreferencedata().subscribe(res => {
      this.localst.store(environment.referencedatakey, res.Data);
      this.databaseName = res.Data.Databasename;
    })
  }
}
