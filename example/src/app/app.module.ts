import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { getProviders } from 'ts-gapi-wrapper/inversify';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule, FormsModule,
    ],
    providers: [...getProviders()],
    bootstrap: [AppComponent],
})
export class AppModule { }
