import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-search-dynamics-list',
  templateUrl: './search-dynamics-list.component.html',
  styleUrls: ['./search-dynamics-list.component.css']
})
export class SearchDynamicsListComponent implements OnInit, OnDestroy {
  // public busy = false;

  confirmationDialogComponentRef: MatDialogRef<ConfirmationDialogComponent>;
  
  @Output() requeueEvent: EventEmitter<string> = new EventEmitter();
  @Output() eventDeleteEvent: EventEmitter<string> = new EventEmitter();
  @Output() eventDeleteAllEvent: EventEmitter<string> = new EventEmitter();
  @Output() eventReqeueueAllEvent: EventEmitter<string> = new EventEmitter();

  @Input() results: Object[];
  show = false;

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

  public performRequeueEvent(eventMessageId: string) {
    console.log('performRequeueEvent', eventMessageId);
     
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: 'Are you sure that you want to re-queue this event?'
    };
     
    this.confirmationDialogComponentRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    this.confirmationDialogComponentRef.afterClosed().subscribe(result => {
      console.log('confirmationDialogComponentRef', result);
      if (result == true) {
        this.requeueEvent.emit( eventMessageId );
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

  public performEventAllDelete() {
    console.log('performEventAllDelete');
     
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: 'Are you sure that you want to delete all of the failed events?'
    };
     
    this.confirmationDialogComponentRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    this.confirmationDialogComponentRef.afterClosed().subscribe(result => {
      console.log('confirmationDialogComponentRef', result);
      if (result == true) {
        this.eventDeleteAllEvent.emit();
      }
    });
  }

  public performEventAllRequeue() {
    console.log('performEventAllRequeue');
     
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: 'Are you sure that you want to re-queue all of the failed events?'
    };
     
    this.confirmationDialogComponentRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    this.confirmationDialogComponentRef.afterClosed().subscribe(result => {
      console.log('confirmationDialogComponentRef', result);
      if (result == true) {
        this.eventReqeueueAllEvent.emit();
      }
    });
  }

  
}

