import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { SharedService } from './shared.service';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
