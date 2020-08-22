import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LogHandlerService } from 'src/app/core/services/log-handler/log-handler.service';
import { ThrowStmt } from '@angular/compiler';
import { Log } from 'src/app/models/log.model';
import { FightsService } from 'src/app/core/services/fights/fights.service';
import { Fight } from 'src/app/models/fight.model';

@Component({
  selector: 'app-fights-pane',
  templateUrl: './fights-pane.component.html',
  styleUrls: ['./fights-pane.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FightsPaneComponent implements OnInit {
  fights: Array<Fight>;

  constructor(
    private readonly fightsService: FightsService,
    private readonly changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this
      .fightsService
      .fights
      .subscribe({
        next: fights => {
          this.fights = fights;
          this.changeDetector.detectChanges();
        },
        error: error => {
          console.error(error);
        }
      });
  }

}
