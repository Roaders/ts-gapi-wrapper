import { injectable, inject } from 'inversify'
import { GapiInitService } from './gapi-init.service';
import { Observable } from 'rxjs';
import { IGapiOptions } from '../contracts';
import { map } from 'rxjs/operators';

@injectable()
export class GapiLoginService{

    constructor(@inject(GapiInitService)private initService: GapiInitService){
    }

    private _loggedInObservable: Observable<boolean> | undefined;

    public loggedInObservable(options: IGapiOptions): Observable<boolean>{
        if(this._loggedInObservable == null){
            this._loggedInObservable = this.createLoggedInStream(options);
        }
        return this._loggedInObservable;
    }

    private createLoggedInStream(options: IGapiOptions){
        return this.initService.initialise(options).pipe(
            map(() => {

                gapi.auth2.init(options)

                const auth = gapi.auth2.getAuthInstance();

                return gapi.auth2.getAuthInstance().isSignedIn.get();
            }),
        );
    }
}