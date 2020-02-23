# ts-gapi-wrapper
> An npm installable wrapper that loads and initialises gapi

It can be a pain using the Google api (gapi) libraries when you are used to installing all your dependencies through npm and bundling them all using webpack into an Angular or React application.

This package hides all the complexities of this behind a simple api and does all of the script loading and initialisation necessary without requiring any extra script tags in your html.

This library is platform agnostic so will work with any framework such as Angular or React.

## Installation

```
npm install ts-gapi-wrapper
npm install @types/gapi @types/gapi.auth2 -D
```

## Example Usage

**Initialise GAPI**

```typescript
import { GapiInitService, IGapiOptions } from 'ts-gapi-wrapper';

export class AppComponent {

    constructor(initService: GapiInitService) {

        const options: IGapiOptions = {
            apiKey: "REPLACE_WITH_API_KEY",
            clientId: "REPLACE_WITH_CLIENT_ID",
            discoveryDocs: [ "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest" ],
            scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
        }

        initService.initialise(options).pipe(
            mergeMap(() => from(gapi.auth2.getAuthInstance())),
        ).subscribe(() => console.log(`Signed In: ${gapi.auth2.getAuthInstance().isSignedIn.get()}`));
    }
}
```


**Login**

```typescript
import { GapiLoginService, GapiInitService, IGapiOptions } from 'ts-gapi-wrapper';

export class MyComponent {

    private options: IGapiOptions = {
        // as above
    }

    constructor(initService: GapiInitService, private loginService: GapiLoginService) {

        initService.initialise(options).pipe(
            mergeMap(() => loginService.loggedInObservable())
        ).subscribe(loggedIn => console.log(`Signed In: ${loggedIn}`));
    }

    public login(){
        initService.initialise(this.options).pipe(
            mergeMap(() => loginService.login()),
        ).subscribe(user => console.log(`USER ${user.getBasicProfile().getName()}`));
    }
}
```
**Other Google APIs**

You are most likely to want to use other APIs apart from just login. To do this you will need to install the relevant types. For example:
```
npm install @types/gapi.client.drive -D
```
And then call the relevant service:
```typescript
public fileSearch(fileName: string) {
    const config = {
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
        q: `name contains \'${fileName}\'`,
    };

    this.initService.initialise(this.options).pipe(
        mergeMap(() => this.loginService.login()),
        mergeMap(() => from(gapi.client.load('drive', 'v3'))),
        mergeMap(() => from(gapi.client.drive.files.list(config))),
    ).subscribe((response) => {
        console.log(`Files Loaded: ${response.result.files}`);
    });
}
```

## DI
This package uses `Inversify` as a Dependency Injection provider. You can instantiate services using the `Inversify` container:
```typescript
import { container } from 'ts-gapi-wrapper';

const loginService = container.get(GapiLoginService);
```
If you are using Angular you can add providers to your module and then inject them as normal:
```typescript
import { getProviders } from 'ts-gapi-wrapper';

@NgModule({
    providers: [...getProviders()]
})
export class AppModule { }
```

## Angular
As the initialisation and loading of the api and the api calls are done outside of Angular zones you must update your UI inside a zone when a result is returned:

```typescript
import { Component, NgZone } from '@angular/core';

@Component()
export class MyComponent{

    public login() {
        this.initialiseGapi().pipe(
            mergeMap(() => this.loginService.login()),
        ).subscribe(
            (user) => this.zone.run(() => {
                this.loginResult = user.getBasicProfile().getName();
            }),
        );
    }
}
```

## Example App

A demonstration app is available in the github repo to demonstrate usage:

```
git clone https://github.com/Roaders/ts-gapi-wrapper.git
cd ts-gapi-wrapper
npm install
npm run build
cd example
npm install
npm start
```
This example app is also available [here](http://giles.roadnight.name/gapi-wrapper/).

To run the example you will need a client ID and an API key. These can be created at the [Google Developers Console](https://console.developers.google.com). The client ID that you create must have the correct Authorised JavaScript origins setup. This will be either `http://giles.roadnight.name` if using the site above or `http://localhost:3000` if running locally.