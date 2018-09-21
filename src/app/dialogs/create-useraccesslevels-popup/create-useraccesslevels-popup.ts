import { Component, Inject } from '@angular/core';
import { IAccessLevelModel } from '../../model/accessLevel.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { ICommonInterface } from '../../model/commonInterface.model';
import { AppConstants } from '../../app.constants';
import * as _ from 'underscore';
import { AlertModule, AlertService } from 'ngx-alerts';
import { IUserAccessLevels, Iservices, IUserFeatures, ISubFeatures, Ifeatures } from '../../model/user-accesslevels.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserAccesslevelsService } from '../../service/user-accesslevels.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'create-useraccesslevels-popup.html',
    styleUrls: ['../../create-user-component/create-user-component.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AccessLevelPopup {
    currentEditEnabledUserAccessLevels: IUserFeatures[];
    currentEditUserDetails: any;
    filteredClientAndUserAccessLevels: IUserAccessLevels;
    filteredAccessIds: Array<IAccessLevelModel>;
    userAccessId: string;
    accessLevelsFormSubmit: FormGroup;
    names: Array<IAccessLevelModel>;
    checkedone = false;
    color = 'primary';
    checkedtwo = false;
    accessLevelData: Array<object>;
    // accessLevelRawData:Array<IAccesLevels>;
    public eventCalls: Array<string> = [];
    config: any;
    userName: string;
    public features: string[];
    public featureDetails: Iservices;
    // public userFeatures: IUserFeatures;
    public userFeaturesArray: IUserFeatures[] = [];
    constructor(
        private userAccessLevelService: UserAccesslevelsService,
        public dialogRef: MatDialogRef<AccessLevelPopup>,
        @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
        private spinnerService: Ng4LoadingSpinnerService, private alertService: AlertService,
        private httpClient: HttpClient) {
        dialogRef.disableClose = true;
        this.accessLevelsFormSubmit = formBuilder.group({
            'access_levels': [null],
            'user_id': [null],
            'client_id': [null],
        });

        // this.getAccessLevelData();
        // this.features = Object.keys(data.services[0]);
        // this.featureDetails = data.services[0];
        this.spinnerService.show();
        this.prepareClientAndUserFeatureAccessLevels(data.id);
        this.userName = this.data.name;
    }
    prepareClientAndUserFeatureAccessLevels = (userId) => {
        // const userAccesslevels = await this.getClientUserAccessLevels();
        // const clientFeatures = await this.getClientFeaturesAccessLevels();
        // tslint:disable-next-line:max-line-length
        const userAccessLevels = this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getuseraccessbyuserid/' + userId);
        // tslint:disable-next-line:max-line-length
        const clientAccessLevels = this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getfat/' + AppConstants.CLIENT_ID);
        forkJoin([userAccessLevels, clientAccessLevels]).subscribe(results => {
            console.log(results);
            if (results[0].custom_status_code === 100 && results[0].http_status_code === 200 &&
                results[1].custom_status_code === 100 && results[1].http_status_code === 200) {
                this.spinnerService.hide();
                this.currentEditUserDetails = results[0].result[0];
                this.currentEditEnabledUserAccessLevels = results[0].result[0].access_levels;
                // tslint:disable-next-line:max-line-length
                this.filteredClientAndUserAccessLevels = this.userAccessLevelService.prepareUserAccessLevels(results[0].result[0].access_levels, results[1].result[0]);
                console.log(this.filteredClientAndUserAccessLevels);
                this.features = Object.keys(this.filteredClientAndUserAccessLevels.services[0]);
                this.featureDetails = this.filteredClientAndUserAccessLevels.services[0];
            } else {
                this.spinnerService.hide();
            }
        });
    }

    onNoClick(): void {
        // console.log(this.data);
        this.dialogRef.close();
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
    // Posting of user access level data to api
    onSubmit = () => {
        this.spinnerService.show();
        this.accessLevelsFormSubmit.controls['access_levels'].setValue(this.currentEditEnabledUserAccessLevels);
        this.accessLevelsFormSubmit.controls['client_id'].setValue(AppConstants.CLIENT_ID);
        this.accessLevelsFormSubmit.controls['user_id'].setValue(this.data.id);
        const formModel = this.accessLevelsFormSubmit.value;
        this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postuseraccess', formModel)
            .subscribe(
            data => {
                if (!data.error && data.custom_status_code === 100) {
                    this.alertService.success('User access levels updated successfully!!!');
                } else if (data.error === true && data.custom_status_code === 102) {
                    this.alertService.warning('Everything is Up-to-date!!!');
                } else if (data.error === true && data.custom_status_code === 101) {
                    this.alertService.warning('Required Parameters are Missing!!!');
                }
                this.spinnerService.hide();
                this.closeDialog();
            },
            error => {
                this.spinnerService.hide();
                this.alertService.danger('User access levels not updated');
            });
    }
    // Getting of user access data if data is not present default checkbox method will call
    getAccessLevelData = () => {
        this.spinnerService.show();
        this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getuseraccess/' + AppConstants.CLIENT_ID)
            .subscribe(
            data => {
                console.log(data);
                if (data.result.length > 0 && data.custom_status_code === 100) {
                    if (this.filteredAccessIds && this.filteredAccessIds.length > 0 && this.filteredAccessIds[0].access_levels) {
                        this.spinnerService.hide();
                    } else {
                        this.spinnerService.hide();
                    }
                } else if (data.result.length === 0 && data.custom_status_code === 101) {
                    this.alertService.warning('Required Parameters are Missing!!!');
                } else {
                }
                this.spinnerService.hide();
            },
            error => {
                console.log(error);
                this.spinnerService.hide();
            }
            );
    }

    configureFeature = (feature: string, index: number, featureItem: Ifeatures) => {
        // tslint:disable-next-line:max-line-length
        const Itemindex = this.currentEditEnabledUserAccessLevels.findIndex(currentFeature => currentFeature.feature_id === featureItem.feature_id);
            this.featureDetails[feature][index].isEnabled = !this.featureDetails[feature][index].isEnabled;
            if (this.featureDetails[feature][index].isEnabled) {
                if (this.featureDetails[feature][index].sub_features) {
                    this.featureDetails[feature][index].has_subfeature = true;
                    const enabledSubFeatures = [];
                    const enabledSubFeaturesObject = <IUserFeatures>{};
                    this.featureDetails[feature][index].sub_features.reduce((prevVal, item) => {
                        item.isEnabled = true;
                        enabledSubFeatures.push(item.subfeature_id);
                    }, []);
                    enabledSubFeaturesObject.feature_id = featureItem.feature_id;
                    enabledSubFeaturesObject.sub_feature_ids = enabledSubFeatures;
                    this.currentEditEnabledUserAccessLevels = ([...this.currentEditEnabledUserAccessLevels, enabledSubFeaturesObject]);
                } else {
                    this.featureDetails[feature][index].has_subfeature = false;
                    const enabledSubFeaturesObject = <IUserFeatures>{};
                    enabledSubFeaturesObject.feature_id = featureItem.feature_id;
                    enabledSubFeaturesObject.sub_feature_ids = [];
                    this.currentEditEnabledUserAccessLevels = ([...this.currentEditEnabledUserAccessLevels, enabledSubFeaturesObject]);
                }
            } else {
                // tslint:disable-next-line:max-line-length
            this.currentEditEnabledUserAccessLevels.splice(Itemindex);
                if (this.featureDetails[feature][index].sub_features) {
                    this.featureDetails[feature][index].sub_features.reduce((prevVal, item) => {
                        item.isEnabled = false;
                    }, []);
                }
            }
            console.log(this.currentEditEnabledUserAccessLevels);
            console.log(this.featureDetails);
        // const feature_id = this.featureDetails[feature][index].feature_id;
        // let sub_feature_ids = [];
        // let userFeatures;
        // const inde = this.userFeaturesArray.findIndex(features => features.feature_id === feature_id);
        // if (this.featureDetails[feature][index].has_subfeature) {
        //     sub_feature_ids = this.featureDetails[feature][index].sub_features.map(item => item.subfeature_id);
        //     if (this.featureDetails[feature][index].isEnabled) {
        //         sub_feature_ids = [];
        //         this.featureDetails[feature][index].isEnabled = false;
        //         this.featureDetails[feature][index].sub_features.reduce((prevVal, item) => {
        //             item.isEnabled = false;
        //         }, []);
        //         this.userFeaturesArray = this.userFeaturesArray.filter(userfeature => userfeature.feature_id !== feature_id);
        //     } else if (!this.featureDetails[feature][index].isEnabled) {
        //         userFeatures = { feature_id: feature_id, sub_feature_ids: sub_feature_ids };
        //         if (inde >= 0) {
        //             this.userFeaturesArray[inde].sub_feature_ids = sub_feature_ids;
        //         } else {
        //             this.userFeaturesArray = ([...this.userFeaturesArray, userFeatures]);
        //         }
        //         this.featureDetails[feature][index].isEnabled = true;
        //         this.featureDetails[feature][index].sub_features.reduce((prevVal, item) => {
        //             item.isEnabled = true;
        //         }, []);
        //     }
        // } else {
        //     if (this.featureDetails[feature][index].isEnabled) {
        //         this.featureDetails[feature][index].isEnabled = false;
        //         this.userFeaturesArray = this.userFeaturesArray.filter(userfeature => userfeature.feature_id !== feature_id);
        //     } else if (!this.featureDetails[feature][index].isEnabled) {
        //         userFeatures = { feature_id: feature_id, sub_feature_ids: [] };
        //         this.userFeaturesArray = ([...this.userFeaturesArray, userFeatures]);
        //         this.featureDetails[feature][index].isEnabled = true;
        //     }
        // }

    }
    configureSubFeature = (featureItem: Ifeatures, feature: string, index: number, index2: number, sub_features: ISubFeatures) => {
        // tslint:disable-next-line:max-line-length
        const Itemindex = this.currentEditEnabledUserAccessLevels.findIndex(currentFeature => currentFeature.feature_id === featureItem.feature_id);
        console.log(Itemindex);
        // tslint:disable-next-line:max-line-length
        const featureinex = this.featureDetails[feature][index].sub_features.findIndex(featureIndexItem => featureIndexItem.subfeature_id === sub_features.subfeature_id);
        console.log(featureinex);
        // tslint:disable-next-line:max-line-length
        this.featureDetails[feature][index].sub_features[featureinex].isEnabled = !this.featureDetails[feature][index].sub_features[featureinex].isEnabled;
        if (Itemindex >= 0) {
            // tslint:disable-next-line:max-line-length
            const userSubfeaturesindex = this.currentEditEnabledUserAccessLevels[Itemindex].sub_feature_ids.findIndex(subItem => subItem === sub_features.subfeature_id);
            console.log(userSubfeaturesindex);
            if (userSubfeaturesindex >= 0) {
                this.currentEditEnabledUserAccessLevels[Itemindex].sub_feature_ids.splice(userSubfeaturesindex, 1);
                if (this.currentEditEnabledUserAccessLevels[Itemindex].sub_feature_ids.length <= 0) {
                    this.currentEditEnabledUserAccessLevels.splice(Itemindex, 1);
                    this.featureDetails[feature][index].isEnabled = false;
                } else {
                    this.featureDetails[feature][index].isEnabled = false;
                }
            } else {
                // tslint:disable-next-line:max-line-length
                this.currentEditEnabledUserAccessLevels[Itemindex].sub_feature_ids = ([...this.currentEditEnabledUserAccessLevels[Itemindex].sub_feature_ids, sub_features.subfeature_id]);
                // tslint:disable-next-line:max-line-length
                if (this.currentEditEnabledUserAccessLevels[Itemindex].sub_feature_ids.length === this.featureDetails[feature][index].sub_features.length) {
                    this.featureDetails[feature][index].isEnabled = true;
                }
            }
        } else {
            const enabledSubFeaturesObject = <IUserFeatures>{};
            enabledSubFeaturesObject.feature_id = featureItem.feature_id;
            enabledSubFeaturesObject.sub_feature_ids = [];
            enabledSubFeaturesObject.sub_feature_ids = ([...enabledSubFeaturesObject.sub_feature_ids, sub_features.subfeature_id]);
            this.currentEditEnabledUserAccessLevels = ([...this.currentEditEnabledUserAccessLevels, enabledSubFeaturesObject]);
            // tslint:disable-next-line:max-line-length
            const currentItemindex = this.currentEditEnabledUserAccessLevels.findIndex(currentFeature => currentFeature.feature_id === featureItem.feature_id);
            // tslint:disable-next-line:max-line-length
            if (this.currentEditEnabledUserAccessLevels[currentItemindex].sub_feature_ids.length === this.featureDetails[feature][index].sub_features.length) {
                this.featureDetails[feature][index].isEnabled = true;
            }
        }
        console.log(this.currentEditEnabledUserAccessLevels);
        // let userFeatures;
        // const feature_id = sub_features.feature_id;
        // const sub_feature_ids = [sub_features.id];
        // const inde = this.userFeaturesArray.findIndex(features => features.feature_id === feature_id);
        // console.log(inde);
        // console.log(this.featureDetails[feature][index].sub_features[index2]);
        // if (inde >= 0) {
            // tslint:disable-next-line:max-line-length
        //   const subFeatureIndex = this.userFeaturesArray[inde].sub_feature_ids.findIndex(sub_feature => sub_feature === sub_features.subfeature_id);
        //     if (subFeatureIndex >= 0) {
        //         this.userFeaturesArray[inde].sub_feature_ids.splice(subFeatureIndex, 1);
        //         if (this.featureDetails[feature][index].sub_features.length === this.userFeaturesArray[inde].sub_feature_ids.length) {
        //             this.featureDetails[feature][index].isEnabled = true;
        //         } else {
        //             this.featureDetails[feature][index].isEnabled = false;
        //         }
        //     } else {
        //         this.userFeaturesArray[inde].sub_feature_ids = [...this.userFeaturesArray[inde].sub_feature_ids, ...sub_feature_ids];
        //         if (this.featureDetails[feature][index].sub_features.length === this.userFeaturesArray[inde].sub_feature_ids.length) {
        //             this.featureDetails[feature][index].isEnabled = true;
        //         } else {
        //             this.featureDetails[feature][index].isEnabled = false;
        //         }
        //     }
        // } else {
        //     userFeatures = { feature_id: feature_id, sub_feature_ids: sub_feature_ids };
        //     this.userFeaturesArray = [...this.userFeaturesArray, ...userFeatures];
        // }
        // this.featureDetails[feature][index].sub_features[index2].isEnabled = true;
    }
}
