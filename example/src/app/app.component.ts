import { Component } from '@angular/core';
import { GapiInitService } from '../../../src';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(initService: GapiInitService) {
        console.log(`Init: ${initService}`);
    }
}
