import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app.module';

const platform = platformBrowserDynamic();

// launch our application
platform.bootstrapModule(AppModule);
