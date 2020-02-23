import { injectable, inject } from 'inversify'
import { GapiInitService } from './gapi-init.service';
import { Observable, of, from, bindCallback, ReplaySubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@injectable()
export class GapiLoginService{

    constructor(@inject(GapiInitService)private initService: GapiInitService){
    }

    private _loggedInObservable: ReplaySubject<boolean> | undefined;

    public login() {
        return from(gapi.auth2.getAuthInstance()).pipe(
            mergeMap(() => {
                if(gapi.auth2.getAuthInstance().isSignedIn.get()){
                    return of(gapi.auth2.getAuthInstance().currentUser.get());
                }
                return from(gapi.auth2.getAuthInstance().signIn())
            })
        )
    }

    public logout(){
        return from(gapi.auth2.getAuthInstance().signOut());
    }

    public loggedInObservable(): Observable<boolean>{
        if(this._loggedInObservable == null){
            this._loggedInObservable = this.createLoggedInStream();
        }
        return this._loggedInObservable;
    }

    private createLoggedInStream(){
        const subject = new ReplaySubject<boolean>(1);
        const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn;

        isSignedIn.listen(state => subject.next(state));

        subject.next(isSignedIn.get())
        return subject;
    }
}