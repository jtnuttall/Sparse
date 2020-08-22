import { Component, OnInit } from '@angular/core';

import { ElectronService } from '../../../core/services/electron/electron.service';
import { LogHandlerService } from 'src/app/core/services/log-handler/log-handler.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  constructor(
    private readonly electron: ElectronService,
    private readonly logHAndler: LogHandlerService
  ) { }

  ngOnInit(): void {
  }

  openLog(): void {
    this.logHAndler.openLog();
  }

  minimize(): void {
    this.currentWindow.minimize();
  }

  maximize(): void {
    if (this.currentWindow.isMaximized()) {
      this.currentWindow.unmaximize();
    } else {
      this.currentWindow.maximize();
    }
  }

  close(): void {
    this.currentWindow.destroy();
  }

  private get currentWindow(): Electron.BrowserWindow {
    return this
      .electron
      .remote
      .getCurrentWindow();
  }
}
