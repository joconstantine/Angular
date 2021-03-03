import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {
  currentNumber = 0;
  ref;
  @Output('emittedNumber') numberEmitter = new EventEmitter<number>();
  @Output('emittedStopEvent') stopEmitter = new EventEmitter<{}>();
  constructor() { }

  ngOnInit(): void {
  }

  onStartGame() {
    this.ref = setInterval(() => {
      this.increaseNumber(); 
    }, 1000);
  }

  onStopGame() {
    if (this.ref)
      clearInterval(this.ref);

    this.currentNumber = 0;
    this.stopEmitter.emit({});
  }

  increaseNumber() {
    this.numberEmitter.emit(this.currentNumber);
    this.currentNumber++;
  }



}
