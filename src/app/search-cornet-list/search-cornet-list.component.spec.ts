import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListCornetComponent } from './search-cornet-list.component';

describe('SearchListCornetComponent', () => {
  let component: SearchListCornetComponent;
  let fixture: ComponentFixture<SearchListCornetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchListCornetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchListCornetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
