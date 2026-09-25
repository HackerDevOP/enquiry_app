import { Component, inject } from '@angular/core';
import { BRAND } from '../../const/global-const';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  protected readonly brand = BRAND.Name;
  private readonly title = inject(Title);

  ngOnInit() {
    this.title.setTitle(this.brand);
  }
}
