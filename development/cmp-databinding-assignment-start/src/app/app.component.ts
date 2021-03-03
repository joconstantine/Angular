import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  oddNumbers: number[] = [];
  evenNumbers: number[] = [];

  onReceiveEmittedNumber(emitData) {
    if (emitData)
    {
        var curNumber = emitData;
        
        if (curNumber % 2 === 0)
        {
          this.evenNumbers.push(curNumber);
        }
        else
        {
          this.oddNumbers.push(curNumber);
        }
    }
  }

  onStopGame(){
    this.oddNumbers = [];
    this.evenNumbers = [];
  }


}
