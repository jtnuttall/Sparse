import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FightItemComponent } from './fight-item.component';

describe('FightItemComponent', () => {
  let component: FightItemComponent;
  let fixture: ComponentFixture<FightItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FightItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FightItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
