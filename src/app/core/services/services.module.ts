import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogHandlerService } from './log-handler/log-handler.service';
import { ParserService } from './parser/parser.service';
import { SettingsService } from './settings/settings.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    LogHandlerService,
    ParserService,
    SettingsService,
  ]
})
export class ServicesModule { }
