import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-academic-verifier-details',
  templateUrl: './academic-verifier-details.page.html',
  styleUrls: ['./academic-verifier-details.page.scss'],
})
export class AcademicVerifierDetailsPage implements OnInit {
  extId: any;
  clubId: any;
  ExtracurricularFrom:FormGroup;
  Extracurricular: any;
  userId: string;
  constructor(private fb: FormBuilder,private route: ActivatedRoute, public router:Router,public toastController:ToastController,
    public storageservice:StorageService) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.clubId=params.clubId;
      this.extId=params.extId;
      });
      this.userId = localStorage.getItem("userId") ;  
      
    this.ExtracurricularFrom = this.fb.group({
      verifierName: ["",Validators.required],
      verifierEmail:["",Validators.required],
      verifierDesignation:["",Validators.required],
      verifierMobile:[""],
      oniCode:[""],
      extId: [""],
      rating: [""],
      remarks: [""],
      currentUserId: [""]
   });
  }


  addverifier(){
    this.storageservice.showLoading();
    this.ExtracurricularFrom.value.currentUserId =this.userId;
    this.ExtracurricularFrom.value.oniCode =this.clubId;
    this.Extracurricular=this.ExtracurricularFrom.value;

 var saveEducation = "api/auth/app/IndividualProfileDetails/addVerifierdetails";

  this.storageservice.postrequest(saveEducation,this.Extracurricular).subscribe(async result => {  
    if (result["success"] == true) {
      this.storageservice.dismissLoading();
        //  const profilePage = new ProfilePage(this.router, this.storageservice, this.elementRef, this.modalController, this.alertController);
        //  profilePage.updateData();
    
      this.presentToast()
      let edit = {
        
        extId:this.extId
           }
     let navigationExtras: NavigationExtras = {
       queryParams: edit
     };
      this.router.navigate(['/rating-extra-popup'],navigationExtras)
      }
  });

  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Saved Successfully',
      duration: 3000,
      cssClass: 'custom-toast'
    });


  await toast.present();
}
move(extId){
  let edit = {
    
    extId:extId
 }
 let navigationExtras: NavigationExtras = {
   queryParams: edit
 };
  this.router.navigate(['/rating-extra-popup'],navigationExtras)
}
}
