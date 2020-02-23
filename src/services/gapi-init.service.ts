import { injectable } from 'inversify'
import { Observable, bindCallback, defer } from 'rxjs'
import { map, mergeMap, shareReplay, share, tap } from 'rxjs/operators'
import { IGapiOptions } from '../contracts';
import loader from 'little-loader';

@injectable()
export class GapiInitService{

    private _initialiseStream: Observable<true> | undefined;
    private _optionsComparison: string | undefined;

    public initialise(options: IGapiOptions): Observable<true>{

        if(this._optionsComparison && JSON.stringify(options) !== this._optionsComparison){
            throw new Error(`initialise called with different options. Only 1 gapi connection per app is supported.`);
        }

        this._optionsComparison = this._optionsComparison || JSON.stringify(options);

        if(this._initialiseStream == null){
            this._initialiseStream = this.createStream(options)
        }

        return this._initialiseStream;
    }

    private createStream(options: IGapiOptions): Observable<true>{

        return bindCallback(loader)('https://apis.google.com/js/api.js').pipe(
            mergeMap(() => bindCallback(gapi.load)('client:auth2')),
            tap(() => gapi.auth2.init(options)),
            map(() => true as const),
            shareReplay(1)
        )
    }

}