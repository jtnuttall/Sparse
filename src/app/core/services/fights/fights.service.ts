import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Fight } from 'src/app/models/fight.model';

@Injectable({
  providedIn: 'root'
})
export class FightsService {
  private _fights = new Subject<Array<Fight>>();

  constructor() { }

  sendFights(fights: Array<Fight>): void {
    this._fights.next(fights);
  }

  get fights(): Subject<Array<Fight>> {
    return this._fights;
  }
}
