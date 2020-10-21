import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GHService } from '../service/GHService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Event Feed';

  eventCols = [
    {field: 'id', header: 'Event ID'},
    {field: 'actor', header: 'Username', nested: 'login'},
    {field: 'type', header: 'Event Type'},
    {field: 'repo', header: 'Repository', nested: 'name'}
  ];
  
  eventsByUser = 'public';

  user: any;
  loading: boolean = false;
  events: any[];

  constructor(private ghService: GHService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    //On Successful Logon event, populate the Event feed
    this.ghService.logonSuccess$.subscribe((message) => {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.updateTable();
    });

    //This component's route is also the callbackUrl for Github authentication
    //If the code parameter is present, complete the authentication process
    this.route.queryParams.subscribe((params: Params) => {
      if(params['code']) {
        this.ghService.authorizeUser(params['code']).then(() => this.router.navigate(['/home']));
      }
    });
    
    if(this.user) {
      this.updateTable(this.events);
    }
  }

  updateTable(events?) {
    if(!events) {
      this.loading = false;
      let obv = this.eventsByUser === 'public' ? this.ghService.getEvents() : this.ghService.getEventByUser(this.user.login);
      obv.subscribe((data: any[]) => {this.events = data; this.loading = false});
    }
    else {
      this.loading = false;
    }
    
  }

  navToDetails(username: string, eventId: number) {
    this.router.navigate(['/details', username, eventId]);
  }

  navToRepo(repo: string) {
    window.open(`https://github.com/${repo}`);
  }
}
