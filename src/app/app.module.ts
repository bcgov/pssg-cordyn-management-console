import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import * as moment from 'moment';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppService } from './app.service';
import { NgbModule, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { SearchListCornetComponent } from './search-cornet-list/search-cornet-list.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SearchComponent } from './search/search.component';
import { SearchContainerComponent } from './search-container/search-container.component';
import { ToastrModule } from 'ngx-toastr';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule, MatInputModule, MatNativeDateModule, MatExpansionModule, MatDialogModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { SearchDynamicsListComponent } from './search-dynamics-list/search-dynamics-list.component';
import { DateRangeDialogComponent } from './shared/date-range-dialog/date-range-dialog.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';


// { path: 'document/:id',    component: DocumentContainerComponent, runGuardsAndResolvers: 'always' },
// { path: 'case/:id',        component: CaseContainerComponent, runGuardsAndResolvers: 'always' },


const appRoutes: Routes = [
  {
    path: '',
    component: SearchContainerComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchListCornetComponent,
    SearchComponent,
    SearchContainerComponent,
    SearchDynamicsListComponent,
    DateRangeDialogComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    NgxLoadingModule.forRoot({
        animationType: ngxLoadingAnimationTypes.threeBounce,
        backdropBackgroundColour: 'rgba(0,0,0,0.1)',
        backdropBorderRadius: '10px',
        primaryColour: '#036',
        secondaryColour: '#325b84',
        tertiaryColour: '#7f99b2'
    }),
    RouterModule.forRoot(
      appRoutes,
      { onSameUrlNavigation: 'reload', enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule, MatInputModule, MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatDialogModule,
    NgbModule,
    NgxChartsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    AppService,
    EnvServiceProvider
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent,
    DateRangeDialogComponent]
})
export class AppModule { }
