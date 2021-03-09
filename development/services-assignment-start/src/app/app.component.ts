import { Component, OnInit } from '@angular/core';
import { CounterService } from './counter.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  activeUsers: string[] = [];
  inactiveUsers: string[] = [];
  activeToInactive;
  inactiveToActive;

  constructor(private usersService: UsersService, public counterService: CounterService) {};

  ngOnInit() {
    this.activeUsers = this.usersService.activeUsers;
    this.inactiveUsers = this.usersService.inactiveUsers;
    this.counterService = this.usersService.counterService;
  }
}
