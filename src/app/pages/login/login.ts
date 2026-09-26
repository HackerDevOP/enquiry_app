import { Component, inject, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { FieldError } from '../../components/field-error/field-error';
import { ToastrService } from '../../services/toast/toast-service';
import { setLocal } from '../../helper/storage';
import { EnquiryService } from '../../services/enquiry/enquiry-service';

export interface ILogin {
  username: string;
  password: string;
}

export const initialLogin: ILogin = {
  username: '',
  password: '',
};

@Component({
  imports: [RouterLink, FormField, FieldError],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private toast = inject(ToastrService);
  private adminService = inject(EnquiryService);
  private readonly route = inject(Router);
  private readonly title = inject(Title);
  protected loginModel = signal(initialLogin);

  protected loginForm = form(this.loginModel, (root) => {
    (required(root.username, { message: 'Username is required' }),
      required(root.password, { message: 'Password is required' }));
  });

  ngOnInit() {
    this.title.setTitle('Admin Login');
  }

  admin = {
    username: 'admin',
    password: '123456',
  };

  onLogin(event: Event) {
    event.preventDefault();
    if (this.loginForm().valid()) {
      const loginDetails = this.loginForm().value();
      if (
        loginDetails.username == this.admin.username &&
        loginDetails.password == this.admin.password
      ) {
        setLocal('admin', loginDetails);
        this.adminService.admin$.next(loginDetails);
        this.route.navigateByUrl('/home');
        return this.toast.success('Login success');
      }
      this.toast.error('Invalid Username or Password');
    }
    return this.toast.error('Invalid form submit');
  }
}
