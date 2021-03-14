import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  defaultSubscription = 'Advanced';
  subscriptions = ['Basic', 'Advanced', 'Pro'];
  @ViewChild('f', {static: true}) signupForm: NgForm;

  onSubmit() {
    console.log(this.signupForm);
  }
}
