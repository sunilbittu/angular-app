import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainModuleRoutingModule, RoutingConstant } from './main-module-routing.module';
import { MainModuleComponent } from './main-module.component';
import { ChartsModule } from 'ng2-charts';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpCalIInterceptor } from 'src/app/Interceptors/Interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SearchPipe3 } from './search.pipe';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { ChatComponent } from 'src/app/components/chat/chat.component';


@NgModule({
  declarations: [MainModuleComponent,RoutingConstant,SearchPipe3, NotificationComponent, ChatComponent],
  imports: [
    CommonModule,
    MainModuleRoutingModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
  ],
  // providers: [{
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: HttpCalIInterceptor,
  //   multi: true
  // }],
})
export class MainModuleModule { }
