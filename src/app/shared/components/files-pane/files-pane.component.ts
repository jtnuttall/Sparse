import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Log } from 'src/app/models/log.model';
import { ResizeEvent } from 'angular-resizable-element';
import { Observable } from 'rxjs';
import { throttleTime, tap } from 'rxjs/operators';
import { LogHandlerService } from '../../../core/services/log-handler/log-handler.service';
import * as moment from 'moment';
import '../../../utilities/array';

@Component({
  selector: 'app-files-pane',
  templateUrl: './files-pane.component.html',
  styleUrls: ['./files-pane.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesPaneComponent implements OnInit, AfterViewInit {
  style: object;
  logs: Array<Log>;
  progress: Observable<number>;
  loading = true;

  constructor(
    private readonly logHandler: LogHandlerService,
    private readonly changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getLogs();
  }

  ngAfterViewInit(): void {
  }

  logTrack(i: number, log: Log): number {
    return log.trackingId;
  }

  onResize(event: ResizeEvent): void {
    this.style = {
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }

  private getLogs(): void {
    this.logs = new Array();
    this.loading = true;
    this.progress =
      this
        .logHandler
        .progress
        .pipe(
          throttleTime(250),
          tap({
            next: () => {
              this.changeDetector.detectChanges();
            }
          }),
        );

    const logSubcription =
      this
        .logHandler
        .logs
        .subscribe({
          next: log => {
            if (log.topDps > 0) {
              this.logs.insertSorted(log, (firstLog, secondLog) =>
                moment(firstLog.date).isAfter(moment(secondLog.date))
              );
            }
          },
          error: error => {
            console.error(error);
          },
          complete: () => {
            this.loading = false;
            this.changeDetector.detectChanges();
            logSubcription.unsubscribe();
          }
        });

    this.logHandler.openAllLogs();
  }
}
