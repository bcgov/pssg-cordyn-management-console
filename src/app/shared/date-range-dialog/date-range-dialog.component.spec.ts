import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeDialogComponent } from './date-range-dialog.component';

describe('DateRangeDialogComponent', () => {
  let component: DateRangeDialogComponent;
  let fixture: ComponentFixture<DateRangeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
