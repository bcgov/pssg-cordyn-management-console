import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  // public busy = false;

  @Output() queryEvent: EventEmitter<object> = new EventEmitter();
  @Output() changeQueueEvent: EventEmitter<string> = new EventEmitter();
  // @Output() requeueLast1Hour: EventEmitter<string> = new EventEmitter();
  // @Output() requeueLast24Hour: EventEmitter<string> = new EventEmitter();

  public currentStatus: string = '';
  public searchByPlaceholder: string = '';

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    public router: Router) { }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      searchString: [this.appService.searchString],
      selectedQueue: [this.appService.selectedQueue]
    });

    this.changeToCornetQueue();
  }

  public performSearch() {
    const searchString = this.form.get('searchString').value;
    console.log('performSearch', searchString, this.currentStatus);
    this.queryEvent.emit({ searchBy: searchString, processCode: this.currentStatus });
  }

  ngOnDestroy() {  }

  public clearField() {
    console.log('clearField');
    this.form.controls['searchString'].setValue(null);
  }

  public changeToCornetQueue(): void {
    console.log('changeToCornetQueue');
    this.searchByPlaceholder = "Search by Event Id or GUID";
    this.form.controls['selectedQueue'].setValue(this.appService.cornetQueueName());
    this.changeQueueEvent.emit(this.appService.cornetQueueName());
  }

  public changeToDynamicsQueue(): void {
    console.log('changeToDynamicsQueue');
    this.searchByPlaceholder = "Search by Event Id";
    this.form.controls['selectedQueue'].setValue(this.appService.dynamicsQueueName());
    this.changeQueueEvent.emit(this.appService.dynamicsQueueName());
  }

  public isCornet(): boolean {
    return (this.form.controls['selectedQueue'].value === this.appService.cornetQueueName());
  }

  public isDynamics(): boolean {
    return (this.form.controls['selectedQueue'].value === this.appService.dynamicsQueueName());
  }

  public setSearchByStatus(processStatusCode: string): void {
    this.currentStatus = processStatusCode;
  }

  public isStatus(processStatusCode: string): boolean {
    return (this.currentStatus === processStatusCode);
  }
    
  public statusLabel(): string {
    switch (this.currentStatus) {
      case 'PRC': return 'Processed Events ';
      case 'ERR': return 'Error Events ';
      case 'INP': return 'In Progress Events ';
      //case 'DUP': return 'Duplicate Events ';
      case 'NEW': return 'New Events ';
      default: return 'All Events ';
    }
  }
}

