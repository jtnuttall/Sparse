import { Injectable } from '@angular/core';

import { ElectronService } from '../electron/electron.service';
import { ParserService } from '../parser/parser.service';
import { SettingsService } from '../settings/settings.service';
import { Subject, zip } from 'rxjs';
import { CombatLine } from 'src/app/models/combat-line.model';
import { Log } from 'src/app/models/log.model';
import * as _ from 'underscore';
import '../../../utilities/array';
import { Stats } from 'fs';
import { Fight } from 'src/app/models/fight.model';

@Injectable({
  providedIn: 'root'
})
export class LogHandlerService {
  logs = new Subject<Log>();
  trackingId = 0;

  /* progress information */
  current = 0;
  total = 0;
  progress = new Subject<number>();

  constructor(
    private readonly electron: ElectronService,
    private readonly parser: ParserService,
    private readonly settings: SettingsService
  ) { }

  openAllLogs(): void {
    const logDirectory = this.settings.logDirectory;

    this.progress.next(0);

    this
      .electron
      .fsObs
      .readDir(logDirectory, {encoding: 'utf-8'})
      .subscribe({
        next: logFiles => {
          this.current = 0;
          this.total = logFiles.length;

          Promise.all(
            logFiles.map(
              logFile => this.processFile(this.electron.path.join(logDirectory, logFile))
            )
          )
          .then(() => {
            this.logs.complete();
            this.logs = new Subject();
            this.progress.complete();
            this.progress = new Subject();
          });
        },
        error: error => {
          throw Error(error); // TODO error handling
        }
      });
  }

  openLog(): void {
    this
      .electron
      .remote
      .dialog
      .showOpenDialog({
        properties: [
          'openFile',
        ],
        filters: [
          {
            name: 'SWTOR Log Files',
            extensions: ['txt']
          }
        ]
      })
      .then((value) => this.processFile(value.filePaths[0]))
      .catch((reason) => {

      });
  }

  private async processFile(filePath: string): Promise<[Buffer, Stats]> {
    const observable =
      zip(
        this
          .electron
          .fsObs
          .readFile(filePath, { encoding: 'utf-8' }),
        this
          .electron
          .fsObs
          .stat(filePath)
      );

    observable.subscribe({
      next: ([data, stats]) => {
        this.current += 1;
        this.progress.next(100 * this.current / this.total);
        this.trackingId += 1;

        const parsedFile =
          this
            .parser
            .parse(data);

        if (!parsedFile) {
          return;
        }

        const actor = this.getPrimaryActor(parsedFile);
        const { combatEvents, nonCombatEvents } = this.getEvents(this.fixTime(parsedFile));

        const fights = combatEvents.map(events => {
          return new Fight({
            combatEvents: events
          });
        });

        this.logs.next(new Log({
          trackingId: this.trackingId,
          filename: this.electron.path.basename(filePath),
          filePath,
          actor,
          date: stats.birthtime,
          fights,
          nonCombatEvents
        }));
      },
      error: (error) => {
        console.error(error);
      }
    });

    return observable.toPromise();
  }

  /**
   * The toon acting in the file should be the most frequent name to appear.
   * TODO edge cases.
   *
   * @param parsedFile The parsed file, as an array of CombatLines.
   */
  private getPrimaryActor(parsedFile: Array<CombatLine>): string {
    const actorMap = new Map<string, number>();

    parsedFile
      .map(line => {
        if (!actorMap.has(line.actor)) {
          actorMap.set(line.actor, 0);
        }

        actorMap.set(line.actor, actorMap.get(line.actor) + 1);

        return line;
      });

    let actor = '';
    let maxCount = 0;
    actorMap.forEach((count, possibleActor) => {
      if (count > maxCount) {
        maxCount = count;
        actor = possibleActor;
      }
    });

    return actor;
  }

  private fixTime(parsedFile: Array<CombatLine>): Array<CombatLine> {
    const firstTime = parsedFile[0].time;
    let lastTime = firstTime;

    return parsedFile
      .map(line => {
        if (line.time < lastTime) {
          line.time += lastTime;
        }
        lastTime = line.time;

        // normalize time to start at 0
        line.time -= firstTime;

        return line;
      });
  }

  /**
   * Send the fights to the subject, filtering out false starts caused by resurrections.
   *
   * @param parsedFile The parsed file, as an array of CombatLines.
   */
  private getEvents(parsedFile: Array<CombatLine>): { combatEvents: Array<Array<CombatLine>>, nonCombatEvents: Array<Array<CombatLine>> } {
    const { beginnings, endings } = this.getCombatIndices(parsedFile);

    // Now we simply zip the beginnings and endings and slice up the list.
    const combatEvents =
      _
        .zip(beginnings, endings)
        .map(([beginning, ending]) => parsedFile.slice(beginning, ending + 1));


    // if (beginnings.length > endings.length) {
    //   console.warn('more act beginnings');
    // }

    // if (endings.length > beginnings.length) {
    //    console.warn('more endings');
    // }
    // _
    //   .zip(beginnings, endings)
    //   .forEach(([beginning, ending]) => {
    //     if (beginning >= ending) {
    //       console.warn(combatEvents, beginnings, endings, parsedFile);
    //     }
    //   });

    // TODO non-combat events
    return {
      combatEvents,
      nonCombatEvents: new Array(new Array<CombatLine>())
    };
  }

  /**
   * Get the indices of all fights, filtering out false EnterCombat and ExitCombat events.
   *
   * @param parsedFile The pared file, as an array of CombatLines.
   */
  private getCombatIndices(parsedFile: Array<CombatLine>): { beginnings: Array<number>, endings: Array<number> } {
    const possibleBeginnings = parsedFile.findIndices(({isCombatStart}) => isCombatStart);
    const possibleEndings = parsedFile.findIndices(({isCombatEnd}) => isCombatEnd);
    const beginnings = new Array<number>();
    const endings = possibleEndings;

    /**
     * Sometimes there are invalid end events, in which two ExitCombat events occur without an
     * interstitial EnterCombat events. We filter these out by passing through the array once
     * and checking that each ending event has an accompanying starting event.
     */
    possibleEndings.push(parsedFile.length);

    for (let e = possibleEndings.length - 1; e > 0; e -= 1) {
      const lastEnding = possibleEndings[e - 1];
      const currentEnding = possibleEndings[e];

      const betweenIndex = possibleBeginnings.findIndex(beginning => {
        return beginning > lastEnding && beginning < currentEnding;
      });

      if (betweenIndex !== -1) {
        beginnings.push(lastEnding);
      }
    }

    endings.reverse();

    // The first possible beginning is always a beginning.
    beginnings.push(possibleBeginnings[0]);
    /**
     * There can be multiple start events before we have an end event. Greedily discard the ones
     * in-between such that we have the longest possible combat window.
     */
    for (let b = 1, e = 0; b < possibleBeginnings.length && e < endings.length;) {
      if (possibleBeginnings[b] < endings[e]) {
        b += 1;
      } else if (possibleBeginnings[b] > endings[e]) {
        beginnings.push(possibleBeginnings[b]);
        e += 1;
      }
    }

    // If there's a dangling start event, add an end event that points to the end of the file.
    if (beginnings.length > endings.length) {
      endings.push(parsedFile.length);
    }

    return {
      beginnings,
      endings
    };
  }
}
