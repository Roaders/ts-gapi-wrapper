import { injectable, inject } from 'inversify'
import { GapiInitService } from './gapi-init.service';

@injectable()
export class GapiLoginService{

    constructor(@inject(GapiInitService)initService: GapiInitService){
        console.log(`GapiLoginService: ${initService}`);
    }
}