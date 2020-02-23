import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GapiInitService, GapiLoginService } from '../../../src';
import { container } from '../../../src/inversify';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [
      {provide: GapiLoginService, useFactory: () => container.get(GapiLoginService) },
      {provide: GapiInitService, useFactory: () => container.get(GapiInitService) },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
