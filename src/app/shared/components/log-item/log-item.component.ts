import { Component, OnInit, Input } from '@angular/core';
import { Log } from 'src/app/models/log.model';
import { FightsService } from '../../../core/services/fights/fights.service';

@Component({
  selector: 'app-log-item',
  templateUrl: './log-item.component.html',
  styleUrls: ['./log-item.component.sass']
})
export class LogItemComponent implements OnInit {
  @Input()
  log: Log;

  constructor(
    private readonly fightsService: FightsService
  ) { }

  ngOnInit(): void {
  }

  click(): void {
    this.fightsService.sendFights(this.log.fights);
  }

}
