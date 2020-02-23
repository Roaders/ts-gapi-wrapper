import { Component, NgZone } from '@angular/core';
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
    public loginState = 'Not Logged In';

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
        const options = this.options;

        if (options == null) {
            return;
        }

        this.initService.initialise(options).subscribe(
            () => this.zone.run(() => this.initState = 'INITIALISED'),
        );
    }

    public login() {
        const options = this.options;

        if (options == null) {
            return;
        }

        this.loginService.loggedInObservable(options).subscribe(
            (loggedIn) => this.zone.run(() => this.loginState = loggedIn ? 'Not Logged In' : 'Logged In'),
        );
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
