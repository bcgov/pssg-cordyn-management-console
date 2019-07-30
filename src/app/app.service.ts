import { Injectable } from '@angular/core';
import { Observable, pipe, Subject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class AppService {

  // public dataChange: Subject<Object> = new Subject<Object>();

  private cachedSearchString: string;
  private cachedSelectedQueue: string = this.cornetQueueName();
  // private cachedSelectedEntities: string[] = [];
  private cachedSelectedEventId: string;
  // private cachedSelectedDocumentId: string;

  private cachedData: Observable<any> = null;

  constructor(private http: HttpClient) { }

  public get searchString(): string {
    return this.cachedSearchString;
  }
  public set searchString(newSearchString: string) {
    this.cachedSearchString = newSearchString;
  }

  public get selectedQueue(): string {
    return this.cachedSelectedQueue;
  }
  public set selectedQueue(newString: string) {
    this.cachedSelectedQueue = newString;
  }

  // public get selectedEntities(): string[] {
  //   return this.cachedSelectedEntities;
  // }
  // public set selectedEntities(newEntity: string[]) {
  //   this.cachedSelectedEntities = newEntity;
  // }

  public get selectedEventId(): string {
    return this.cachedSelectedEventId;
  }
  public set selectedEventId(newEventId: string) {
    this.cachedSelectedEventId = newEventId;
  }

  // public get selectedDocumentId(): string {
  //   return this.cachedSelectedDocumentId;
  // }
  // public set selectedDocumentId(newDocumentId: string) {
  //   this.cachedSelectedDocumentId = newDocumentId;
  // }

  public getCachedData(): Observable<any> {
    return of(this.cachedData);
  }

  public getExistingResults(): any {
    return this.cachedData;
  }

  private titleCase(str) {
    return str.toLowerCase().split(' ').map(word => {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }

  public cornetQueueName(): string {
    return 'cornet';
  }

  public dynamicsQueueName(): string {
    return 'dynamics';
  }

  public searchCornet(searchString: string, searchProcessCode: string): Observable<any> {
    console.log('appService searchCornet', searchString, searchProcessCode);

    if (!searchString) {
      return this.http.get(`https://dev.jag.gov.bc.ca/ords/devc/cmsords/web/queueEvents?process_status_cd=${searchProcessCode}`)
        .pipe(
          map((resp: HttpResponse<any>) => {
            console.log('search results', resp);
            return resp;
          })
        );
    } else {
      return this.http.get(`https://dev.jag.gov.bc.ca/ords/devc/cmsords/web/eventByIdOrGuid?id_or_guid=${searchString}`)
      .pipe(
        map((resp: HttpResponse<any>) => {
          console.log('search results', searchString, resp);
          return resp;
        })
      );
    }
  }

  requeueLastHour(): Observable<any> {
    return this.http.get('https://dev.jag.gov.bc.ca/ords/devc/cmsords/web/requeueEventsLast1Hour')
    .pipe(
      map((resp: HttpResponse<any>) => {
        // if (resp['respCd'] === 0) {
        //   this.toastr.success('x has been successfully updated', '');
        // }
        return resp;
      })
    );
  }

  requeueLast24Hour(): Observable<any> {
    return this.http.get('https://dev.jag.gov.bc.ca/ords/devc/cmsords/web/requeueEventsLast24Hours')
    .pipe(
      map((resp: HttpResponse<any>) => {
        return resp;
      })
    );
  }

  requeueEventById(eventMessageId: number): Observable<any> {
    return this.http.get(`https://dev.jag.gov.bc.ca/ords/devc/cmsords/web/requeueEventById?id=${eventMessageId}`)
    .pipe(
      map((resp: HttpResponse<any>) => {
        return resp;
      })
    );
  }

  requeueEventByDateRange(startDate: Date, endDate: Date): Observable<any> {    
    var startDateStr = moment(startDate).format("YYYY-MM-DD");
    var endDateStr = moment(endDate).format("YYYY-MM-DD");

    return this.http.get(`https://dev.jag.gov.bc.ca/ords/devc/cmsords/web/requeueEventsByDtRange?from_dt=${startDateStr}&to_dt=${endDateStr}`)
    .pipe(
      map((resp: HttpResponse<any>) => {
        return resp;
      })
    );
  }

  deleteCornetEvent(eventMessageId: string): Observable<any> {
    return this.http.delete(`https://dev.jag.gov.bc.ca/ords/devc/cmsords/web/event?id=${eventMessageId}`)
    .pipe(
      map((resp: HttpResponse<any>) => {
        return resp;
      })
    );
  }  

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

  searchDynamics(searchString: string): Observable<any> {
    console.log('appService searchDynamics', searchString);

    if (!searchString) {
      return this.http.get('http://cordyn-rabbitmq-interface-controller-route-wyck1k-dev.pathfinder.gov.bc.ca/api/Rabbit/messages')
      .pipe(
        map((resp: HttpResponse<any>) => {
           console.log('search results', resp);
  
           return resp;
        })
      );    
    } else {
      return this.http.get(`http://cordyn-rabbitmq-interface-controller-route-wyck1k-dev.pathfinder.gov.bc.ca/api/Rabbit/message?id=${searchString}`)
      .pipe(
        map((resp: HttpResponse<any>) => {
           console.log('search results', resp);
  
           return resp;
        })
      );    
    }    
  }  

  requeueDynamicsAllEvents(): Observable<any> {
    return this.http.post(`http://cordyn-rabbitmq-interface-controller-route-wyck1k-dev.pathfinder.gov.bc.ca/api/Rabbit/requeueall`, '')
    .pipe(
      map((resp: HttpResponse<any>) => {
        return resp;
      })
    );
  } 

  requeueDynamicsEventById(eventMessageId: number): Observable<any> {
    return this.http.post(`http://cordyn-rabbitmq-interface-controller-route-wyck1k-dev.pathfinder.gov.bc.ca/api/Rabbit/requeue?id=${eventMessageId}`, '')
    .pipe(
      map((resp: HttpResponse<any>) => {
        return resp;
      })
    );
  } 

  deleteDynamicsEvent(eventMessageId: string): Observable<any> {
    return this.http.delete(`http://cordyn-rabbitmq-interface-controller-route-wyck1k-dev.pathfinder.gov.bc.ca/api/Rabbit/deletemessage?id=${eventMessageId}`)
    .pipe(
      map((resp: HttpResponse<any>) => {
        return resp;
      })
    );
  }  

  deleteDynamicsAllEvents(): Observable<any> {
    return this.http.delete(`http://cordyn-rabbitmq-interface-controller-route-wyck1k-dev.pathfinder.gov.bc.ca/api/Rabbit/deletemessages`)
    .pipe(
      map((resp: HttpResponse<any>) => {
        return resp;
      })
    );
  }

  public queryCachedData(): void {
    console.log('queryCachedData');
    // this.dataChange.next(this.cachedData);
  }

  public clearData(): void {
    console.log('clearData');
    // const data = {
    //   'documents': [],
    //   'issuelistentities': [],
    //   'cases': []
    // };

    this.searchString = '';
    this.selectedEventId = '';

    // this.selectedDocumentId = '';
    // this.selectedEntities = [];
    // this.dataChange.next(data);
  }
}

