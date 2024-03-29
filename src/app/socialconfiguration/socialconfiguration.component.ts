import { Component, OnInit } from '@angular/core';
import { ITPKeysConfig, ISocialKeys } from '../model/tirdparty-keysconfig.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
// import { ISocialKeys } from '../model/socialKeys.model';

@Component({
  selector: 'app-socialconfiguration',
  templateUrl: './socialconfiguration.component.html',
  styleUrls: ['./socialconfiguration.component.scss']
})
export class SocialconfigurationComponent implements OnInit {
  TPKeyId: string;
  configKeysArray: ITPKeysConfig[];
  btn_text = 'save';
  smtpItems: any;
  public isEdit = false;
  facebookform: FormGroup;
  twitterform: FormGroup;
  chatcampform: FormGroup;
  whatsappform: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    private router: Router) {
    this.facebookform = this.formBuilder.group({
      fbappid: ['', Validators.required],
      fbappversion: ['', Validators.required]
    });
    this.twitterform = this.formBuilder.group({
      twconsumerkey: ['', Validators.required],
      twconsumersecret: ['', Validators.required],
      twaccesstoken: ['', Validators.required],
      twaccesssecret: ['', Validators.required]
    });
    this.chatcampform = this.formBuilder.group({
      ccappid: ['', Validators.required],
      ccappkey: ['', Validators.required]
    });
    this.whatsappform = this.formBuilder.group({
      whatsappinstaceid: ['', Validators.required],
      whatsappclientid: ['', Validators.required],
      whatsappclientsecret: ['', Validators.required],
      whatsappclientphonenumber: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.TPKeyId = null;
    this.getConfigureKeysData();
    console.log('asdfd');
  }

  // Fb keys form submit to server
  onFBSubmit = (fbForm) => {
    this.saveKeysIntoServer(fbForm, 'facebook');
    console.log(fbForm);
  }
  // twitter keys form submit to server
  onTwitterSubmit = (twitterForm) => {
    console.log(twitterForm);
    this.saveKeysIntoServer(twitterForm, 'twitter');
  }
  // chatcamp keys form submit to server
  onChatcampSubmit = (chatcampForm) => {
    console.log(chatcampForm);
    this.saveKeysIntoServer(chatcampForm, 'chatcamp');
  }
  // whatapp keys form submit to server
  onWhatsappSubmit = (whatsappForm) => {
    console.log(whatsappForm);
    this.saveKeysIntoServer(whatsappForm, 'whatsapp');
  }
  // find the tab changes
  onTabChange = (tabevent) => {
    this.isEdit = false;
    if (this.configKeysArray) {
      this.parseJsonDataToForm(this.configKeysArray[tabevent.index]);
    }
  }
  // form edit handling
  EditConfigItems() {
    this.isEdit = true;
    this.btn_text = 'update';
  }
  // cancel click handing
  cancelFileEdit() {
    this.isEdit = false;
  }
  // post form data to the server
  saveKeysIntoServer = (formData, sourccename: string) => {
    this.spinnerService.show();
    let keysConfigPostData: ITPKeysConfig;
    keysConfigPostData = <ITPKeysConfig>{};
    keysConfigPostData.client_id = AppConstants.CLIENT_ID;
    keysConfigPostData.source_name = sourccename;
    keysConfigPostData.thirdparty_id = this.TPKeyId;
    keysConfigPostData.source_keys = formData;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postthirdparty', keysConfigPostData).subscribe(
      resp => {
          if (resp.custom_status_code === 100) {
            this.alertService.success('Updated successfully.');
          } else if (resp.custom_status_code === 101) {
            this.alertService.warning('Required Parameters are Missing!!!');
          } else if (resp.custom_status_code === 102) {
            this.alertService.warning('Everything is Up-to-date!!!');
          }
        // this.alertService.success('Updated successfully.');
        this.spinnerService.hide();
      },
      err => {
        this.spinnerService.hide();
        console.log(err);
      }
    );
  }

  // get third party configured keys data from server
  getConfigureKeysData = () => {
    this.spinnerService.show();
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getthirdparty/' + AppConstants.CLIENT_ID).subscribe(
      resp => {
        console.log(resp);
        this.spinnerService.hide();
          if (resp.custom_status_code === 100 && resp.result.length > 0) {
            this.configKeysArray = resp.result;
            this.parseJsonDataToForm(resp.result[0]);
          } else if (resp.custom_status_code === 101) {
            this.alertService.warning('Something went wrong');
          }
      },
      err => {
        this.spinnerService.hide();
        console.log(err);
      }
    );
  }
  // Prepare the config keys data and bind these data to the respected forms
  parseJsonDataToForm = (configData: ITPKeysConfig) => {
    try {
      this.TPKeyId = configData.id;
      const parsedKeysData: ISocialKeys = configData.source_keys;
      switch (configData.source_name) {
        case 'facebook':
          this.facebookform.controls['fbappid'].setValue(parsedKeysData.fbappid);
          this.facebookform.controls['fbappversion'].setValue(parsedKeysData.fbappversion);
          break;
        case 'twitter':
          this.twitterform.controls['twconsumerkey'].setValue(parsedKeysData.twconsumerkey);
          this.twitterform.controls['twconsumersecret'].setValue(parsedKeysData.twconsumersecret);
          this.twitterform.controls['twaccesstoken'].setValue(parsedKeysData.twaccesstoken);
          this.twitterform.controls['twaccesssecret'].setValue(parsedKeysData.twaccesssecret);
          break;
        case 'whatsapp':
          this.whatsappform.controls['whatsappinstaceid'].setValue(parsedKeysData.whatsappinstaceid);
          this.whatsappform.controls['whatsappclientid'].setValue(parsedKeysData.whatsappclientid);
          this.whatsappform.controls['whatsappclientsecret'].setValue(parsedKeysData.whatsappclientsecret);
          this.whatsappform.controls['whatsappclientphonenumber'].setValue(parsedKeysData.whatsappclientphonenumber);
          break;
        case 'chatcamp':
          this.chatcampform.controls['ccappid'].setValue(parsedKeysData.ccappid);
          this.chatcampform.controls['ccappkey'].setValue(parsedKeysData.ccappkey);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
