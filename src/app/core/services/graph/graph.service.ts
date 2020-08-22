import { Injectable } from '@angular/core';
import { Fight } from 'src/app/models/fight.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  fight = new Subject<Fight>();

  constructor() { }

  sendFight(fight: Fight): void {
    this.fight.next(fight);
  }
}
