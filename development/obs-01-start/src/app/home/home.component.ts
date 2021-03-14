import { Component, OnDestroy, OnInit } from '@angular/core';

import { interval, Subscription, Observable, Observer } from 'rxjs';
import { map, filter } from 'rxjs/operators'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private firstObsSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    // this.firstObsSubscription = interval(1000).subscribe(next => {
    //   console.log(next);
    // })

    const customIntervalObservable = new Observable((observer: Observer<number>) => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        if (count === 5) {
          observer.complete();
        }
        if (count > 3) {
          observer.error(new Error('Count is greater than 0'));
        }
        count++;
      }, 1000);
    })
    
    const customIntervalPipe = customIntervalObservable.pipe(
      filter((data: number) => {
        return data > 0;
      }),
      map((data: number) => {
      return "Route: " + (data + 1);
    }));

    this.firstObsSubscription = customIntervalPipe.subscribe(data => {
      console.log(data);
    }, (error:Error) => {
      console.log(error.message);
    }, () => {
      console.log('Completed!');
    })
  }
  
  ngOnDestroy() {
    this.firstObsSubscription.unsubscribe();
  }
  
}
