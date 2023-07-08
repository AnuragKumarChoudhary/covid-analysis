import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covid_analysis';
  menu_flag = 1;
  menu_type = "menu";

  constructor(private router: Router) { }

  goToRoute(route: string) {
    this.router.navigate([route]);
    if(this.menu_flag==0){
      this.toggleMenu();
    }
  }

  toggleMenu() {
    document.querySelector(".route_container")?.classList.toggle("show");
    document.querySelector(".menu")?.classList.toggle("shift");
    if (this.menu_flag == 0) {
      this.menu_type = "menu";
      this.menu_flag = 1;
    } else {
      this.menu_type = "close";
      this.menu_flag = 0;
    }
  }
}
