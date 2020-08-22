import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { bindNodeCallback, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  os: typeof os;
  path: typeof path;

  fsObs: {
    readFile: (path: fs.PathLike, options: { encoding: string, flag?: string }) => Observable<Buffer>;
    stat: (path: fs.PathLike) => Observable<fs.Stats>;
    readDir: (path: fs.PathLike, options: {encoding: BufferEncoding, withFileTypes?: false}) => Observable<Array<string>>;
  };

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.os = window.require('os');
      this.path = window.require('path');
      this.addFsExtensions();
    }
  }

  addFsExtensions(): void {
    this.fsObs = {
      readFile: bindNodeCallback(this.fs.readFile),
      stat: bindNodeCallback(this.fs.stat),
      readDir: bindNodeCallback(this.fs.readdir),
    };
  }
}
