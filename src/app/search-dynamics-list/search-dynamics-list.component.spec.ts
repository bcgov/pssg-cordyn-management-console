import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDynamicsListComponent } from './search-dynamics-list.component';

describe('SearchDynamicsListComponent', () => {
  let component: SearchDynamicsListComponent;
  let fixture: ComponentFixture<SearchDynamicsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDynamicsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDynamicsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
