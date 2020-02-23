import { Container } from 'inversify';
import { GapiLoginService, GapiInitService } from '../services';

export const container = new Container();

container.bind(GapiLoginService).to(GapiLoginService).inSingletonScope();
container.bind(GapiInitService).to(GapiInitService).inSingletonScope();
