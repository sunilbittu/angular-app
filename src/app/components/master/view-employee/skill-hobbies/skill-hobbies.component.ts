import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-skill-hobbies',
  templateUrl: './skill-hobbies.component.html',
  styleUrls: ['./skill-hobbies.component.css']
})
export class SkillHobbiesComponent implements OnInit {
  public skillRemarkModel: any;
  public skillModel: any;
  public skillRemarkModel1: any;
  public skillModel1: any;
  public showSuccessMsg: boolean=false;
  public showSuccessMsg2: boolean=false;
  public showSuccessMsg3: boolean=false;
  public skillDetailsId: any;
  public skillObject: any;
  public hobbiesModel: any;
  public errorCount: any;
  public errorCount2: any;
  public errorCount3: any;
  public showErrorMsg: boolean=false;
  public showErrorMsg2: boolean=false;
  public showErrorMsg3: boolean=false;
  public successCount: any;
  public successCount2: any;
  public successCount3: any;
  public listOfEmployeeResults1:any[]=[];
  public listOfEmployeeResults2:any[]=[];
  public listOfEmployeeResults3:any[]=[];
  public editEmployeeId:any=sessionStorage.getItem("Edit-employeeId");
  public hobbiesModel1: any;
  public hobbiesRemarkModel: any;
  public hobbiesRemarkModel1: any;
  public hobbiesDetailsId: any;
  public hobbiesObject: any;
  public achivementsRemarkModel: any;
  public achivementsModel: any;
  public achivementsObject: any;
  public achievementsDetailsId: any;
  public achivementsModel1: any;
  public achivementsRemarkModel1: any;
  public experienceModel: any;
  public experienceModel1: any;
  public isHobbiesfilled:boolean=false;
  public isSkillsfilled:boolean=false;
  public isAchivementsfilled:boolean=false;
  public isSkillsExcpeinecefilled:boolean=false;
  public submitted:boolean=false;
  public submitted2:boolean=false;
  public submitted3:boolean=false;
  public requiredErrorText = 'can\'t be blank';
  

  constructor(public crudOperationsService:CrudOperationsService,private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.fetchSkills();
    this.fetchHobbies();
    this.fetchAchivements();
  }
  changedExp(){
    this.isSkillsExcpeinecefilled=true;
  }
  changedname(){
    this.isSkillsfilled=true;
  }
  changedExp2(){
    this.isSkillsExcpeinecefilled=true;
  }
  changedname2(){
    this.isSkillsfilled=true;
  }
  createSkills(){
    this.submitted=true;

    if(this.skillModel==undefined || this.skillModel==" "){
      this.isSkillsfilled=false;
    }else{
      this.isSkillsfilled=true;

    }
    if(this.experienceModel==undefined || this.experienceModel == " "){
      this.isSkillsExcpeinecefilled=false;
    }else{
      this.isSkillsExcpeinecefilled=true;

    }
    
    if(this.isSkillsExcpeinecefilled && this.isSkillsfilled){
      let object:any={"skillName":this.skillModel,
      "skillRemarks":this.skillRemarkModel,
      "experience":this.experienceModel,
      "employee":{"employeeId":sessionStorage.getItem("Edit-employeeId")}
    }
this.crudOperationsService.create(object,'employeeskilldetail').subscribe((data:any)=>{
console.log(data);
this.isSkillsExcpeinecefilled=false;
this.isSkillsfilled=false;
this.submitted=false;
this.skillRemarkModel="";
this.skillModel="";
this.experienceModel="";
this.fetchSkills();
})
    }
  
  }
  fetchSkills(){
    let api:any='employeeskilldetail/list?employeeId='+sessionStorage.getItem("Edit-employeeId");
    this.crudOperationsService.getList(api).subscribe((data:any)=> {
      this.skillObject=data.data.content;
    })
  }
  editSkill(data:any){
    this.skillDetailsId=data.skillDetailsId;
    this.skillModel1=data.skillName;
    this.skillRemarkModel1=data.skillRemarks;
    this.experienceModel1=data.experience;
  }
  updateSkill(){
    let object:any={"skillName":this.skillModel1,
                    "skillRemarks":this.skillRemarkModel1,
                  "experience":this.experienceModel
                   }
    let api:any='employeeskilldetail/'+this.skillDetailsId;
    this.crudOperationsService.update(object ,api).subscribe((data:any)=> {
      console.log(data);
      this.fetchSkills();
      this.skillModel1="";
      this.skillRemarkModel1="";
        })
  }
  removeSkill(data:any){
    this.skillDetailsId=data.skillDetailsId;
  }
  deleteSkill(){
    let api:any='employeeskilldetail/'+this.skillDetailsId;
    this.crudOperationsService.delete(api).subscribe((data:any)=> {
      console.log(data);
      this.fetchSkills();
    })
  }
  createHobbies(){
    this.submitted2=true;
    if(this.hobbiesModel ==undefined || this.hobbiesModel ==" "){
      this.isHobbiesfilled=false;
    }else{
      this.isHobbiesfilled=true;
    }
       
    if(this.isHobbiesfilled){
    let object:any={"hobbiesName":this.hobbiesModel,
                "hobbiesRemarks":this.hobbiesRemarkModel,
                "employee":{"employeeId":sessionStorage.getItem("Edit-employeeId")}
              }
      this.crudOperationsService.create(object,'employeehobbiesdetail').subscribe((data:any)=>{
        console.log(data);
      this.fetchHobbies();
      this.hobbiesModel="";
      this.hobbiesRemarkModel="";
      this.submitted2=false;
      })
    }
  }
  fetchHobbies(){
    let api:any='employeehobbiesdetail/list?employeeId='+sessionStorage.getItem("Edit-employeeId");
    this.crudOperationsService.getList(api).subscribe((data:any)=> {
      this.hobbiesObject=data.data.content;
    })
  }
  editHobbies(data:any){
    this.hobbiesDetailsId=data.hobbiesDetailsId;
    this.hobbiesModel1=data.hobbiesName;
    this.hobbiesRemarkModel1=data.hobbiesRemarks
  }
  updateHobbies(){
    let object:any={"hobbiesName":this.hobbiesModel1,
                    "hobbiesRemarks":this.hobbiesRemarkModel1
                   }
    let api:any='employeehobbiesdetail/'+this.hobbiesDetailsId;
    this.crudOperationsService.update(object ,api).subscribe((data:any)=> {
      console.log(data);
      this.fetchHobbies();
      this.hobbiesModel1="";
      this.hobbiesRemarkModel1="";
        })
  }
  removeHobbies(data:any){
    this.hobbiesDetailsId=data.hobbiesDetailsId;
  }
  deleteHobbies(){
    let api:any='employeehobbiesdetail/'+this.hobbiesDetailsId;
    this.crudOperationsService.delete(api).subscribe((data:any)=> {
      console.log(data);
      this.fetchHobbies();
    })
  }
  createAchivements(){
    this.submitted3=true;

    if(this.achivementsModel==undefined ||  this.achivementsModel ==" "){
      this.isAchivementsfilled=false;
    }else{
      this.isAchivementsfilled=true;

    }
       
    if(this.isAchivementsfilled){
    let object:any={"achievementsName":this.achivementsModel,
                "achievementsRemarks":this.achivementsRemarkModel,
                "employee":{"employeeId":sessionStorage.getItem("Edit-employeeId")}
              }
      this.crudOperationsService.create(object,'employeeachievementsdetail').subscribe((data:any)=>{
        console.log(data);
      this.fetchAchivements();
      this.achivementsModel="";
      this.achivementsRemarkModel="";
      this.submitted3=false;
      })
    }
  }
  fetchAchivements(){
    let api:any='employeeachievementsdetail/list?employeeId='+sessionStorage.getItem("Edit-employeeId");
    this.crudOperationsService.getList(api).subscribe((data:any)=> {
      this.achivementsObject=data.data.content;
    })
  }
  editAchivements(data:any){
    this.achievementsDetailsId=data.achievementsDetailsId;
    this.achivementsModel1=data.achievementsName;
    this.achivementsRemarkModel1=data.achievementsRemarks;
  }
  updateAchivements(){
    let object:any={"skillName":this.achivementsModel1,
                    "skillRemarks":this.achivementsRemarkModel1
                   }
    let api:any='employeeachievementsdetail/'+this.achievementsDetailsId;
    this.crudOperationsService.update(object ,api).subscribe((data:any)=> {
      console.log(data);
      this.fetchAchivements();
      this.achivementsModel1="";
      this.achivementsRemarkModel1="";
        })
  }
  removeAchivements(data:any){
    this.achievementsDetailsId=data.achievementsDetailsId;
  }
  deleteAchivements(){
    let api:any='employeeachievementsdetail/'+this.achievementsDetailsId;
    this.crudOperationsService.delete(api).subscribe((data:any)=> {
      console.log(data);
      this.fetchAchivements();
    })
  }
clear(){
  this.skillModel1="";
  this.skillRemarkModel1="";
  this.hobbiesModel1="";
  this.hobbiesRemarkModel1="";
  this.achivementsModel1="";
  this.achivementsRemarkModel1="";
}

public importFileData1:any = null;


importFileSkill(event:any){
  if (event.target.files && event.target.files[0]) {
    console.log(event.target.files[0].type);
    
    if(event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      this.importFileData1 = event.target.files[0];
    }
    }else{
    
    }

  } 


  submitImportSkill(){
    if(this.importFileData1 != null){
       let compId:any =sessionStorage.getItem('companyId');
      let form = new FormData();
      form.append("file",this.importFileData1);
      form.append("companyId",compId);
      form.append('employeeId',this.editEmployeeId);

      let api:any="employee/employeeSkillImport/"+this.editEmployeeId;
      this.crudOperationsService.create(form,api).subscribe((data:any) => {
        this.fetchSkills();
        this.listOfEmployeeResults1 = [];
        this.listOfEmployeeResults1 = data.data;
        
       this.successCount = (this.listOfEmployeeResults1[(this.listOfEmployeeResults1.length-1)])["importSucessCount"];
       this.errorCount = (this.listOfEmployeeResults1[(this.listOfEmployeeResults1.length-1)])["importErrorCount"];
      console.log(this.successCount);
      console.log(this.errorCount);
        if(this.successCount > 0){
          this.showSuccessMsg = true;
       
        }
        if(this.errorCount > 0){
          this.showErrorMsg = true;
      
        

      }
    })
  }
}

public importFileData2:any = null;


importFileHobbie(event:any){
  if (event.target.files && event.target.files[0]) {
    console.log(event.target.files[0].type);
    
    if(event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      this.importFileData2 = event.target.files[0];
    }
    }else{
    
    }

  } 


  submitImportHobbie(){
    if(this.importFileData2 != null){
       let compId:any =sessionStorage.getItem('companyId');
      let form = new FormData();
      form.append("file",this.importFileData2);
      form.append("companyId",compId);
      form.append('employeeId',this.editEmployeeId);

      let api:any="employee/employeeHobbieImport/"+this.editEmployeeId;
      this.crudOperationsService.create(form,api).subscribe((data:any) => {
        console.log(data)
        this.fetchHobbies();
        this.listOfEmployeeResults2 = [];
        this.listOfEmployeeResults2 = data.data;
       this.successCount2 = (this.listOfEmployeeResults2[(this.listOfEmployeeResults2.length-1)])["importSucessCount"];
       this.errorCount2 = (this.listOfEmployeeResults2[(this.listOfEmployeeResults2.length-1)])["importErrorCount"];
        if(this.successCount2 > 0){
          this.showSuccessMsg2 = true;
       
        }
        if(this.errorCount2 > 0){
          this.showErrorMsg2 = true;
      
        

      }
    })
  }
}


public importFileData3:any = null;


importFileAchivement(event:any){
  if (event.target.files && event.target.files[0]) {
    console.log(event.target.files[0].type);
    
    if(event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      this.importFileData3 = event.target.files[0];
    }
    }else{
    
    }

  } 


  submitImportAchivement(){
    if(this.importFileData3 != null){
       let compId:any =sessionStorage.getItem('companyId');
      let form = new FormData();
      form.append("file",this.importFileData3);
      form.append("companyId",compId);
      form.append('employeeId',this.editEmployeeId);

      let api:any="employee/employeeAchivementImport/"+this.editEmployeeId;
      this.crudOperationsService.create(form,api).subscribe((data:any) => {
        console.log(data)
        this.fetchAchivements();
        this.listOfEmployeeResults3 = [];
        this.listOfEmployeeResults3 = data.data;
       this.successCount3 = (this.listOfEmployeeResults1[(this.listOfEmployeeResults3.length-1)])["importSucessCount"];
       this.errorCount3 = (this.listOfEmployeeResults1[(this.listOfEmployeeResults3.length-1)])["importErrorCount"];
        if(this.successCount3 > 0){
          this.showSuccessMsg3 = true;
       
        }
        if(this.errorCount3 > 0){
          this.showErrorMsg3 = true;
      
        

      }
    })
  }
}



} 
