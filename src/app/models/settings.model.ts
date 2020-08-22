import { ElectronService } from '../core/services/electron/electron.service';

export class Settings {
    logDirectory: string;
    loadFilesOnStart: boolean;
    recentFiles: Array<string>;
    recentFilesMaxLength: number;

    constructor(electron: ElectronService) {
        this.logDirectory = undefined;
        const home = electron.os.homedir();
        try {
          electron.fs.statSync(electron.path.join(home, 'OneDrive'));
          this.logDirectory = electron.path.join(home, 'OneDrive', 'Documents', 'Star Wars - The Old Republic', 'CombatLogs');
        } catch (e) {
          this.logDirectory = electron.path.join(home, 'Documents', 'Star Wars - The Old Republic', 'CombatLogs');
        }

        this.loadFilesOnStart = false;
        this.recentFiles = [];
        this.recentFilesMaxLength = 10;
    }
}
