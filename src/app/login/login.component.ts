import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { AlertifyService } from '../alertify/alertify.service'
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../environments/environment.prod';
import { Logpriority } from '../models/loanmodel';
import { ApiService } from '../services';
import { CropapiService } from '../services/crop/cropapi.service';
import { ReferenceService } from '../services/reference/reference.service';
import { Users } from '../models/commonmodels';

@Component({
  selector: 'auth-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  authType: string = '';
  title: string = '';
  isValidForm: boolean = true;
  authForm: FormGroup;
  private loggedIn: boolean;
  username: string;
  password: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public toastr: ToastsManager,
    public alertifyService: AlertifyService,
    public localst: LocalStorageService,
    public referencedataapi: ReferenceService
  ) {

    this.authForm = this.fb.group({
      'LoginId': ['', Validators.required],
      'Password': ['', Validators.required]
    });
  }

  showSuccess() {
    this.toastr.success('You are awesome!', 'Success!');
  }
  showError() {
    this.toastr.error('This is not good!', 'Oops!');
  }

  showWarning() {
    this.toastr.warning('You are being warned.', 'Alert!');
  }

  showInfo() {
    this.toastr.info('Just some information for you.');
  }

  showCustom() {
    this.toastr.custom('<span style="color: red">Message in red.</span>', null, { enableHTML: true });
  }

  signOut(): void {
  }

  ngOnInit() {
    this.title = 'Test Tour of Heroes';
  }

  login() {
    debugger
    let userfound=Users[this.username];
    if(userfound!=undefined && this.username==this.password)
     {
      this.localst.store(environment.logpriority, Logpriority.Low);
      this.localst.store(environment.uid, userfound);
      this.getreferencedata();
      //this.router.navigateByUrl("/home/loanoverview/000001/000/summary");
      this.router.navigateByUrl("/home/loans");
    }
    else {
      this.toastr.error('Invalid username or password');
    }
  }

  getreferencedata() {
    this.referencedataapi.getreferencedata().subscribe(res => {
      this.localst.store(environment.referencedatakey, res.Data);
    })
  }


}