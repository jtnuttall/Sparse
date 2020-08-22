import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesPaneComponent } from './files-pane.component';

describe('FilesPaneComponent', () => {
  let component: FilesPaneComponent;
  let fixture: ComponentFixture<FilesPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
