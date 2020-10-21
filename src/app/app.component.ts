import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { GHService } from './service/GHService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  
  title = 'gh-event-viewer-ang';
  user: any;

  constructor(private ghService: GHService, private router: Router) {}

  ngOnInit(): void {
    if(sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }

    this.ghService.logonSuccess$.subscribe((message) => {
      this.user = JSON.parse(sessionStorage.getItem('user'));
    });
  }

  //Github OAuth2 Authentication Link
  login(): void {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${environment.client_id}&scope=repo%20user`;
  }

  logout(): void {
    sessionStorage.clear();
    this.user = null;
    this.router.navigate(['/']);
  }
}
