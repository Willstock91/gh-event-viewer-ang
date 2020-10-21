import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GHService } from '../service/GHService';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  selectedEvent;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private ghService: GHService) { }

  ngOnInit() {
    let username = this.route.snapshot.paramMap.get('username');
    let eventId = this.route.snapshot.paramMap.get('eventId');
    this.ghService.getEventByUserAndId(username, eventId).subscribe(data => {
      this.selectedEvent = data;
      this.loading = false;
    });
  }

  navToRepo(repo: string) {
    window.open(`https://github.com/${repo}`);
  }
}
