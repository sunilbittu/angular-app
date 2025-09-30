import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule ,Routes} from '@angular/router';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';


const routes: Routes = [
  {path:'',component:DashboardComponent,children:[
    // { path : 'hostelDetail', component : HostelDetailComponent},
    // { path : 'hostelBlocks', component : HostelBlocksComponent},
  
  ]}
]

@NgModule({
  // declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    NgxChartsModule
  ],
  exports: [RouterModule] ,
  
  providers:[]

})
export class DashboardModule { }
