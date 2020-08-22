import { Component, OnInit, Input } from '@angular/core';
import { Fight } from '../../../models/fight.model';
import { GraphService } from '../../../core/services/graph/graph.service';

@Component({
  selector: 'app-fight-item',
  templateUrl: './fight-item.component.html',
  styleUrls: ['./fight-item.component.sass']
})
export class FightItemComponent implements OnInit {
  @Input()
  fight: Fight;

  constructor(
    private readonly graphService: GraphService
  ) { }

  ngOnInit(): void {
  }

  click(): void {
    this.graphService.sendFight(this.fight);
  }

}
