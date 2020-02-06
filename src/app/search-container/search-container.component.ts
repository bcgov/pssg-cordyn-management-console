import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.css']
})
export class SearchContainerComponent implements OnInit {

  public results: Object[] = null;
  public busy: boolean;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
  }

  public onQuery(params: object) {
    var searchBy = params['searchBy'];
    var processCode = params['processCode'];

    console.log('onQuery', searchBy, processCode);
    
    this.results = null;

    if (this.isCornetView()) {
      this.queryCornetData(searchBy, processCode);
    } else if (this.isDynamicsView()) {
      this.queryDynamicsData(searchBy);
    }
  }

  public onChangeQueueEvent(queueName: string): void {
    console.log('onChangeQueueEvent', queueName);
    this.appService.selectedQueue = queueName;
    
    this.results = null;
  }

  public isCornetView(): boolean {
    return (this.appService.selectedQueue === this.appService.cornetQueueName());
  }

  public isDynamicsView(): boolean {
    return (this.appService.selectedQueue === this.appService.dynamicsQueueName());
  }  

  public queryCornetData(searchBy: string, processCode: string): void { 
    console.log('queryCornetData', 'searchBy', searchBy, 'processCode', processCode);   
    this.busy = true;

    this.appService.searchCornet(searchBy, processCode)
      .subscribe(
        resp => {
          // console.log(`search response: ${JSON.stringify(resp, null, 1)}`);

          console.log('queryCornetData done');
          this.results = (resp) ? resp['events'] : [];
          
          for (let entry of this.results) {
            entry['warning'] = '';
            if (entry['process_status_cd'] === 'PRC') {
              var event_data = entry['event_data'];    
              //console.log('event_data', event_data);             
              for (let key in event_data) {
                console.log('key/value pair', key, event_data[key]); 
                var event_row = event_data[key];
                if (event_row['data_element_nm'] === 'FETCHED_DATE' && event_row['data_value_txt'] === 'NULL') {
                  //console.log('key/value pair', key, event_data[key], 'yes'); 
                  entry['warning'] = 'Event is Processed but not fetched';
                }
              }
            }
          }

          // sorted on the server side
          
          this.busy = false;
        },
        (error: any) => {
          console.log('queryCornetData error: ', error);
          this.toastr.error('Server error... unable to retrieve the events');
          this.busy = false;
        }
      );
  }

  public onDeleteCornetEvent(id: string): void {
    console.log('onDeleteCornetEvent', id);
    this.busy = true;

    this.appService.deleteCornetEvent(id)
      .subscribe(
        resp => {
          console.log(`onDeleteCornetEvent response: ${JSON.stringify(resp, null, 1)}`);
            
          this.toastr.success('Event has been successfully deleted');
          this.busy = false;
        },
        (error: any) => {
          console.log('onDeleteCornetEvent error: ', error);
          
          this.toastr.error('Server error... event was not deleted');
          this.busy = false;
        });  
  }

  public onRequeueCornetLast1Hour(): void {
    console.log('onRequeueCornetLast1Hour');
    this.busy = true;

    this.appService.requeueLastHour()
      .subscribe(
        resp => {
          console.log(`onRequeueCornetLast1Hour response: ${JSON.stringify(resp, null, 1)}`);

          this.toastr.success('Failed events from the last hour have been successfully re-queued');
          this.busy = false;
        },
        (error: any) => {
          console.log('requeueLastHour error: ', error);

          this.toastr.error('Server error... events were not requeued');
          this.busy = false;
        });  
  }

  public onRequeueCornetLast24Hour(): void {
    console.log('onRequeueCornetLast24Hour');
    this.busy = true;

    this.appService.requeueLast24Hour()
      .subscribe(
        resp => {
          console.log(`onRequeueCornetLast24Hour response: ${JSON.stringify(resp, null, 1)}`);

          this.toastr.success('Failed events from the last 24 hours have been successfully re-queued');
          this.busy = false;
        },
        (error: any) => {
          console.log('onRequeueCornetLast24Hour error: ', error);

          this.toastr.error('Server error... events were not requeued');
          this.busy = false;
        });  
  }

  public onRequeueCornetEvent(eventMessageId: number): void {
    console.log('onRequeueCornetEvent', eventMessageId);
    this.busy = true;

    this.appService.requeueEventById(eventMessageId)
      .subscribe(
        resp => {
          console.log(`onRequeueCornetEvent response: ${JSON.stringify(resp, null, 1)}`);
          
          this.toastr.success('Event ' + eventMessageId + ' has been successfully re-queued');
          this.busy = false;
        },
        (error: any) => {
          console.log('onRequeueCornetEvent error: ', error);
          
          this.toastr.error('Server error... events were not requeued');
          this.busy = false;
        });  
  }

  public onRequeueCornetByDateRange(dateRange: string): void {
    console.log('onRequeueCornetByDateRange', dateRange);
    this.busy = true;

    var jsonObject : any = JSON.parse(dateRange);
    this.appService.requeueEventByDateRange(jsonObject.startDate, jsonObject.endDate)
      .subscribe(
        resp => {
          console.log(`onRequeueCornetByDateRange response: ${JSON.stringify(resp, null, 1)}`);
            
          this.toastr.success('Failed events within the date range have been successfully re-queued');
          this.busy = false;
        },
        (error: any) => {
          console.log('onRequeueCornetByDateRange error: ', error);
          
          this.toastr.error('Server error... events were not requeued');
          this.busy = false;
        });  
  }

  private getEventTypeDesc(cd: string): string {   
    // TODO use code table 
    switch (cd) {
      case 'TOMBSTONE': return 'Tombstone';
      case 'DISC_CHRG': return 'Disciplinary Charge';
      case 'CHRG_REGU': return 'Disciplinary Charge Regulation';
      case 'TRANSFER': return 'Transfer';
      case 'TRANS_RSN': return 'Transfer Reason';
      case 'STATUTE': return 'Statute';
      case 'LOCATION': return 'Location';
      case 'PECH_XREF': return 'Personal Characteristics Xref';
      case 'CLIENT_IA': return 'Client Inmate Assessment';
      case 'CREATE_IA': return 'Create Client IA';
      case 'ACT': return 'Act';
      case 'CLIE_MRGE': return 'Client Merge';
      case 'CLIE_SRCH': return 'Client Search';
      case 'KEY_DATE': return 'Key Date';
      case 'MOVEMENT': return 'Movement';
      case 'HEARING': return 'Hearing';
      case 'STATE_TRAN': return 'State Transition';
      case 'VICT_CNTCT': return 'Victim Contact';
      case 'AUTH_DOCM': return 'Authority Document';
      default: return cd;
    }
  }

  public queryDynamicsData(searchString: string): void { 
    console.log('queryDynamicsData', searchString);   
    this.busy = true;

    this.appService.searchDynamics(searchString)
      .subscribe(
        resp => {
          //console.log(`search response: ${JSON.stringify(resp, null, 1)}`);

          console.log('queryDynamicsData this.appService.searchString', this.appService.searchString);
          this.results = (resp) ? resp['messages'] : [];

          for (let entry of this.results) {
            // console.log('entry', entry);

            entry['event_data'] = [];
            entry['event_payload'] = null;
            entry['event_dtm'] = null;
            if (entry['properties'] && entry['properties']['headers']) {
              entry['event_dtm'] = entry['properties']['headers']['date'];
            }

            var payload : any = JSON.parse(entry['payload']);
            // console.log('jsonObject', payload);
            
            for (let key in payload) {
              // console.log('payload key/value pair', key, payload[key]); 

              if (payload[key]) {
                if (key === 'event_id') {
                  entry['event_id'] = payload[key];
                } else if (key === 'event_type') {
                  entry['event_type'] = payload[key];
                  entry['event_type_desc'] = this.getEventTypeDesc(entry['event_type']);
                } else if (key === 'event_dtm') {
                  entry['event_dtm'] = payload[key];
                } else if (key === 'payload') {
                  //entry['payload'] = [];
                  //console.log('key/payload', key, payload[key]);
                  entry['event_payload'] = payload[key];
                } else {
                  entry['event_data'].push({'data_element_nm': key, 'data_value_txt': payload[key]});
                }
              }
            }
          }

          this.results.sort(function (a, b) {
            var date1 = a['event_dtm'];
            var date2 = b['event_dtm'];

            if (!date1) {
              date1 = new Date('1900-01-01');
            } else {
              date1 = new Date(date1);
            }

            if (!date2) {
              date2 = new Date('1900-01-01');
            } else {
              date2 = new Date(date2);
            }

            return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
          });

          this.busy = false;
        },
        (error: any) => { // HttpErrorResponse
          console.log('queryDynamicsData error: ', error);

          if (error.status == 404) {
            this.results = [];
          } else {
            this.toastr.error('Server error... unable to retrieve the events');
          }
          this.busy = false;
        }
      );
  }

  public onRequeueDynamicsEvent(eventMessageId: number): void {
    console.log('onRequeueDynamicsEvent', eventMessageId);
    this.busy = true;

    this.appService.requeueDynamicsEventById(eventMessageId)
      .subscribe(
        resp => {
          console.log(`onRequeueDynamicsEvent response: ${JSON.stringify(resp, null, 1)}`);
            
          this.toastr.success('Event ' + eventMessageId + ' has been successfully re-queued');
          this.busy = false;
        },
        (error: any) => {
          console.log('onRequeueDynamicsEvent error: ', error);
          
          this.toastr.error('Server error... events were not requeued');
          this.busy = false;
        });  
  }

  public onDeleteDynamicsEvent(id: string): void {
    console.log('onDeleteDynamicsEvent', id);
    this.busy = true;

    this.appService.deleteDynamicsEvent(id)
      .subscribe(
        resp => {
          console.log(`onDeleteDynamicsEvent response: ${JSON.stringify(resp, null, 1)}`);
            
          this.toastr.success('Event has been successfully deleted');
          this.busy = false;
        },
        (error: any) => {
          console.log('onDeleteDynamicsEvent error: ', error);
          
          this.toastr.error('Server error... event was not deleted');
          this.busy = false;
        });  
  }

  public onDeleteDynamicsAllEvents(): void {
    console.log('onDeleteDynamicsAllEvents');
    this.busy = true;

    this.appService.deleteDynamicsAllEvents()
      .subscribe(
        resp => {
          console.log(`onDeleteDynamicsAllEvents response: ${JSON.stringify(resp, null, 1)}`);
            
          this.toastr.success('All events has been successfully deleted');
          this.busy = false;
        },
        (error: any) => {
          console.log('onDeleteDynamicsAllEvents error: ', error);
          
          this.toastr.error('Server error... events were not deleted');
          this.busy = false;
        });  
  }

  public onRequeueDynamicsAllEvents(): void {
    console.log('onRequeueDynamicsAllEvents');
    this.busy = true;

    this.appService.requeueDynamicsAllEvents()
      .subscribe(
        resp => {
          console.log(`onRequeueDynamicsAllEvents response: ${JSON.stringify(resp, null, 1)}`);
            
          this.toastr.success('All events has been successfully re-queued');
          this.busy = false;
        },
        (error: any) => {
          console.log('onRequeueDynamicsAllEvents error: ', error);
          
          this.toastr.error('Server error... events were not deleted');
          this.busy = false;
        });  
  }
}
