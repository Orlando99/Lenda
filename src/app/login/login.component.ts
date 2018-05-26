import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { AlertifyService } from '../alertify/alertify.service'

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
    public alertifyService: AlertifyService
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
    if (this.username == 'admin' && this.password == 'admin') {
      this.router.navigateByUrl('/master/dashboard');
    }
    else {
      this.toastr.error('Invalid username or password');
    }
  }
}
