import { Component } from '@angular/core';
import { BRAND } from '../../const/global-const';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly brand = BRAND.Name
}
