import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { LogItemComponent } from './log-item/log-item.component';
import { FilesPaneComponent } from './files-pane/files-pane.component';

import { ResizableModule } from 'angular-resizable-element';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GraphComponent } from './graph/graph.component';
import { FightsPaneComponent } from './fights-pane/fights-pane.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { FightItemComponent } from './fight-item/fight-item.component';
import { DataPaneComponent } from './data-pane/data-pane.component';


@NgModule({
  declarations: [
    MenuComponent,
    GraphComponent,
    FightsPaneComponent,
    FilesPaneComponent,
    LogItemComponent,
    FightItemComponent,
    DataPaneComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    ResizableModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  exports: [
    MenuComponent,
    GraphComponent,
    FightsPaneComponent,
    FilesPaneComponent,
    LogItemComponent
  ]
})
export class ComponentsModule { }
