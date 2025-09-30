import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(public crudOperationsService:CrudOperationsService,public datePipe:DatePipe) { }
  public headers:any=["S No","Head Lines","News","Date","Action"];
  public newsData:any=[];
  //model
  public headlinesModel:any="";
  public descriptionModel:any="";
  public newsdate:any;
  public dateModel:any;
  public companyId = Number(sessionStorage.getItem("companyId"));
  public employeeId = Number(sessionStorage.getItem("empId"));
  public togglebtn:boolean=true;
  ngOnInit(): void {
    let api:any='announcement/'+this.companyId+"/News";
    this.crudOperationsService.getList(api).subscribe((data:any)=> {
      this.newsData=data.data;
    })
  }
  onDateChange(event:any){
    this.newsdate = this.datePipe.transform(event, 'yyyy-MM-dd');
    
  }
  saveNews(){
    let obj={
		  announcementType:"News",
      announcementName:this.headlinesModel,
      announcementSubject:this.descriptionModel,
      announcementDate:this.newsdate,
      company:{companyId:this.companyId}
    }
    let api:any='announcement';
    this.crudOperationsService.create(obj,api).subscribe((data:any)=> {
      this.cancel();
      this.ngOnInit();
      (<any>$('#addQueryManagement')).modal('hide');
    })
  }
  public newsId:any;
  editNews(data:any){
    this.newsId=data.announcementId;
    this.togglebtn=false;
    this.headlinesModel=data.announcementName;
    this.descriptionModel=data.announcementSubject;
    this.dateModel=data.announcementDate;
    console.log(data);
  }
  cancel(){
    this.togglebtn=true;
    this.headlinesModel="";
    this.descriptionModel="";
    this.dateModel="";
  }
  updateNews(){
    let obj={
		  announcementType:"News",
      announcementName:this.headlinesModel,
      announcementSubject:this.descriptionModel,
      announcementDate:this.dateModel,
      company:{companyId:this.companyId}
    }
    let api:any='announcement/'+this.newsId;
    this.crudOperationsService.update(obj,api).subscribe((data:any)=> {
      this.cancel();
      this.ngOnInit();
      (<any>$('#addQueryManagement')).modal('hide');

    })
  }
  public newsitemId:any;
  deleteItem(id:any){
    this.newsitemId=id;
    console.log(id)
  }
  deleteNews(){
    let url="announcement/"+this.newsitemId;
    this.crudOperationsService.delete(url).subscribe((data)=>{
      this.ngOnInit();
    })
  }
}
