import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GHService {
  
  public logonSuccess$: EventEmitter<String>;

  constructor(private http: HttpClient) {
    this.logonSuccess$ = new EventEmitter();
  }

  getEvents() {
    return this.http.get('https://api.github.com/events');
  }

  getEventByUser(username) {
    return this.http.get(`https://api.github.com/users/${username}/events/public`);
  }

  getEventByUserAndId(username, eventId) {
      return this.getEventByUser(username).pipe(map((data: any[]) => data.find(i => i.id == eventId)));
  }

  authorizeUser(code) {
      const corProxy = 'https://cors-anywhere.herokuapp.com/';
      let h = new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json'
      });
      return this.http.post( corProxy + 'https://github.com/login/oauth/access_token', {
          client_id: environment.client_id,
          client_secret: environment.client_secret,
          code: code
      }, {headers: h}).toPromise().then((token: any) => {
          sessionStorage.setItem('token', token.access_token);
          return this.http.get('https://api.github.com/user').toPromise().then((data: any) => {
              sessionStorage.setItem('user', JSON.stringify(data));
              this.logonSuccess$.emit('success');
          });
      })
  }
}