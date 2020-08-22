import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FightsPaneComponent } from './fights-pane.component';

describe('FightsPaneComponent', () => {
  let component: FightsPaneComponent;
  let fixture: ComponentFixture<FightsPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FightsPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FightsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
