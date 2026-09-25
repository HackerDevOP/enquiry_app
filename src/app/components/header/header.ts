import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { BRAND } from '../../const/global-const';
import { UpperCasePipe } from '@angular/common';
import { getLocal, removeLocal } from '../../helper/storage';
import { ToastrService } from 'ngx-mat-toast';
import { ILogin } from '../../pages/login/login';
import { EnquiryService } from '../../services/enquiry/enquiry-service';

@Component({
  imports: [RouterLink, UpperCasePipe],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected readonly toast = inject(ToastrService);
  protected readonly adminService = inject(EnquiryService);
  private readonly route = inject(Router);
  protected readonly title = inject(Title);
  protected readonly brand = BRAND.Name;
  protected readonly admin = signal<ILogin | null>(null);
  protected isMobileMenuOpen = signal<boolean>(false);

  ngOnInit() {
    this.title.setTitle('home');
    this.admin.set(getLocal('admin'));
    this.adminService.admin$.subscribe(() => {
      this.admin.set(getLocal('admin'));
    });
  }

  logOff() {
    removeLocal('admin');
    this.adminService.admin$.subscribe(() => {
      this.admin.set(getLocal('admin'));
    });
    this.toast.error('Log out success');
    this.route.navigate(['/home']);
  }
}
