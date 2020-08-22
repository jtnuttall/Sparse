import { Injectable, OnDestroy } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { Settings } from '../../../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnDestroy {
  private settings: Settings;

  constructor(
    private readonly electron: ElectronService
  ) {
    try {
      this.electron.fs.statSync('./settings.json');
      this.settings = JSON.parse(this.electron.fs.readFileSync('./settings.json', {encoding: 'utf-8'}));
    } catch (e) {
      this.settings = new Settings(this.electron);
    }
  }

  ngOnDestroy(): void {
    this.save();
  }

  save(): void {
    this.electron.fs.writeFileSync('./settings.json', JSON.stringify(this.settings, undefined, 2));
  }

  addRecentFile(filename: string): void {
    if (this.settings.recentFiles.includes(filename)) {
      this.removeRecentFile(filename); // filenames must be unique, move this one to front of list
    }

    this.settings.recentFiles.splice(0, 0, filename);
    this.settings.recentFiles = this.settings.recentFiles.slice(0, this.settings.recentFilesMaxLength - 1);
  }

  removeRecentFile(filename: string): void {
    this.settings.recentFiles = this.settings.recentFiles.filter(currentFilename => currentFilename !== filename);
  }

  get logDirectory(): string {
    return this.settings.logDirectory;
  }

  get loadFilesOnStart(): boolean {
    return this.settings.loadFilesOnStart;
  }

  get recentFiles(): Array<string> {
    return this.settings.recentFiles;
  }

  get settingsObject(): Settings {
    return this.settings;
  }
}
