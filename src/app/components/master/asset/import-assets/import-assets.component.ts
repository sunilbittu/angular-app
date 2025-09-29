import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-import-assets',
  templateUrl: './import-assets.component.html',
  styleUrls: ['./import-assets.component.css']
})
export class ImportAssetsComponent implements OnInit {
  public assetissue_importform!:FormGroup;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.assetissue_importform = this.formBuilder.group({
      assetissue_empcode:[''],
      assetissue_assestcode:[''],
      assetissue_issuedate:[''],
      assetissue_duedate:[''],
      assetissue_receivedate:[''],
      assetissue_remarks:['']
    
   
    })
  }

  importassest_save(){

    console.log("assetsissueimport",this.assetissue_importform.value);
  }

}
