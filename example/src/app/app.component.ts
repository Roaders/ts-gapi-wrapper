import { Component, NgZone } from '@angular/core';
import { empty } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GapiInitService, GapiLoginService, IGapiOptions } from 'ts-gapi-wrapper';

const OPTIONS_STORAGE_KEY = 'gapi.wrapper.example.options';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {

    public CLIENT_ID: string | undefined;
    public API_KEY: string | undefined;
    public DISCOVERY_DOCS: string = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    public SCOPES: string = 'https://www.googleapis.com/auth/drive.metadata.readonly';

    public initState = 'Not Initialised';
    public loginState = 'Not Subscribed';
    public loginResult = '';
    public logoutResult = '';

    constructor(private initService: GapiInitService, private loginService: GapiLoginService, private zone: NgZone) {
        const optionsString: string | null = window.localStorage.getItem(OPTIONS_STORAGE_KEY);
        const options: Partial<IGapiOptions> | undefined = optionsString ? JSON.parse(optionsString) : undefined;

        if (options != null) {
            this.API_KEY = options.apiKey || this.API_KEY;
            this.CLIENT_ID = options.clientId || this.CLIENT_ID;
            this.DISCOVERY_DOCS = Array.isArray(options.discoveryDocs) ?
                options.discoveryDocs[0] :
                this.DISCOVERY_DOCS;
            this.SCOPES = options.scope || this.SCOPES;
        }
    }

    public initialise() {
        this.initialiseStream().subscribe(
            () => this.zone.run(() => this.initState = 'INITIALISED'),
        );
    }

    public subscribeToLoggedIn() {
        this.initialiseStream().pipe(
            mergeMap(() => this.loginService.loggedInObservable()),
        ).subscribe(
            (loggedIn) => this.zone.run(() => {
                this.loginState = loggedIn ? 'Logged In' : 'Not Logged In';
            }),
        );
    }

    public login() {
        this.initialiseStream().pipe(
            mergeMap(() => this.loginService.login()),
        ).subscribe(
            (user) => this.zone.run(() => {
                this.loginResult = user.getBasicProfile().getName();
                this.logoutResult = '';
            }),
        );
    }

    public logout() {
        this.initialiseStream().pipe(
            mergeMap(() => this.loginService.logout()),
        ).subscribe(
            () => this.zone.run(() => {
                this.logoutResult = 'Logged Out';
                this.loginResult = '';
            }),
        );
    }

    private initialiseStream() {
        const options = this.options;

        if (options == null) {
            return empty();
        }

        return this.initService.initialise(options);
    }

    private get options(): IGapiOptions | undefined {
        if (this.CLIENT_ID == null || this.API_KEY == null || this.DISCOVERY_DOCS == null || this.SCOPES == null) {
            alert(`CLIENT_ID, API_KEY, DISCOVERY_DOCS and SCOPES must be set`);
            return undefined;
        }

        const options: IGapiOptions = {
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            discoveryDocs: [this.DISCOVERY_DOCS],
            scope: this.SCOPES,
        };

        window.localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options));

        return options;
    }
}
