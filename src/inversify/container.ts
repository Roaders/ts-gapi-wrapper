import { Container } from 'inversify';
import { GapiLoginService, GapiInitService } from '../services';

export const container = new Container();

container.bind(GapiLoginService).to(GapiLoginService).inSingletonScope();
container.bind(GapiInitService).to(GapiInitService).inSingletonScope();

export function getProviders(){
    return [
        { provide: GapiLoginService, useFactory: () => container.get(GapiLoginService) },
        { provide: GapiInitService, useFactory: () => container.get(GapiInitService) },
    ];
}
