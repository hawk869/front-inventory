import {Component, OnInit} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  mobileQuery: MediaQueryList;
  userName: any;
  menuNav = [
    { name: 'Home', route: 'home', icon: 'home'},
    { name: 'Categorias', route: 'category', icon: 'category'},
    { name: 'Productos', route: 'product', icon: 'production_quantity_limits'}
  ]

  constructor(media: MediaMatcher, private keyclaokService: KeycloakService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }
  ngOnInit() {
    this.userName = this.keyclaokService.getUsername();
  }

  logout(){
    this.keyclaokService.logout().then(r => console.log(r));
  }
}
