import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GapiInitService, GapiLoginService } from 'ts-gapi-wrapper';
import { container } from 'ts-gapi-wrapper/inversify';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule, FormsModule,
    ],
    providers: [
        { provide: GapiLoginService, useFactory: () => container.get(GapiLoginService) },
        { provide: GapiInitService, useFactory: () => container.get(GapiInitService) },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
