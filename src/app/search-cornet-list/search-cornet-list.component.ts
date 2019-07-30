import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AppService } from '../app.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { DateRangeDialogComponent } from '../shared/date-range-dialog/date-range-dialog.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-search-cornet-list',
  templateUrl: './search-cornet-list.component.html',
  styleUrls: ['./search-cornet-list.component.css']
})
export class SearchListCornetComponent implements OnInit, OnDestroy {
  // public busy = false;

  confirmationDialogComponentRef: MatDialogRef<ConfirmationDialogComponent>;
  dateRangeDialogComponentRef: MatDialogRef<DateRangeDialogComponent>;

  @Output() requeueEvent: EventEmitter<string> = new EventEmitter();
  @Output() eventDeleteEvent: EventEmitter<string> = new EventEmitter();
  @Output() requeueLast1Hour: EventEmitter<string> = new EventEmitter();
  @Output() requeueLast24Hour: EventEmitter<string> = new EventEmitter();
  @Output() requeueByDateRange: EventEmitter<string> = new EventEmitter();

  @Input() results: Object[];

  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    public router: Router) { }

  public ngOnInit() {  }

  ngOnDestroy() {  }

  public get dataExists(): boolean {
    return (this.results) ? (this.results.length > 0) : false;
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }

  public selectEvent(eventMessageId: string): void {
    console.log('selectEvent', eventMessageId);

    this.appService.selectedEventId = eventMessageId;
  }

  public isEventActive(eventMessageId: string): boolean {
    return (this.appService.selectedEventId === eventMessageId);
  }
    
  public getStatusClass(value: string) {
    switch (value) {
      case "PRC": return "badge badge-success float-right";
      case "ERR": return "badge badge-danger float-right";
      case "INP": return "badge badge-info float-right";
      case "DUP": return "badge badge-secondary float-right";
      case "NEW": return "badge badge-primary float-right";
    }
  }

  public performRequeueEvent(eventMessageId: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: 'Are you sure that you want to requeue this event?'
    };
     
    this.confirmationDialogComponentRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    this.confirmationDialogComponentRef.afterClosed().subscribe(result => {
      console.log('confirmationDialogComponentRef', result);
      if (result == true) {
        this.requeueEvent.emit( eventMessageId );
      }
    });
  }

  public performRequeueLast1Hour() {   
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: 'Are you sure that you want to requeue all of the failed events from the last hour?'
    };
     
    this.confirmationDialogComponentRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    this.confirmationDialogComponentRef.afterClosed().subscribe(result => {
      console.log('confirmationDialogComponentRef', result);
      if (result == true) {
        this.requeueLast1Hour.emit();
      }
    });
  }

  public performRequeueLast24Hour() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: 'Are you sure that you want to requeue all of the failed events from the last 24 hours?'
    };
     
    this.confirmationDialogComponentRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    this.confirmationDialogComponentRef.afterClosed().subscribe(result => {
      console.log('confirmationDialogComponentRef', result);
      if (result == true) {
        this.requeueLast24Hour.emit(); 
      }
    });
  }

  public performRequeueByDateRange() {
    this.dateRangeDialogComponentRef = this.dialog.open(DateRangeDialogComponent);

    this.dateRangeDialogComponentRef.disableClose = true;

    this.dateRangeDialogComponentRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.requeueByDateRange.emit(result);
      }
    });
  }

  public performEventDelete(eventMessageId: string) {
    console.log('performEventDelete', eventMessageId);    
     
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: 'Are you sure that you want to delete this event?'
    };
     
    this.confirmationDialogComponentRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    this.confirmationDialogComponentRef.afterClosed().subscribe(result => {
      console.log('confirmationDialogComponentRef', result);
      if (result == true) {
        this.eventDeleteEvent.emit( eventMessageId );
      }
    });
  }

}

