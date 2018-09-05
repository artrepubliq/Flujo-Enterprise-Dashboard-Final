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
import { IUserAccessLevels, Iservices, IUserFeatures, ISubFeatures } from '../../model/user-accesslevels.model';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'create-useraccesslevels-popup.html',
    styleUrls: ['../../create-user-component/create-user-component.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AccessLevelPopup {
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
    public features: string[];
    public featureDetails: Iservices;
    // public userFeatures: IUserFeatures;
    public userFeaturesArray: IUserFeatures[] = [];
    constructor(
        public dialogRef: MatDialogRef<AccessLevelPopup>,
        @Inject(MAT_DIALOG_DATA) public data: IUserAccessLevels, private formBuilder: FormBuilder,
        private spinnerService: Ng4LoadingSpinnerService, private alertService: AlertService,
        private httpClient: HttpClient) {
        dialogRef.disableClose = true;
        this.accessLevelsFormSubmit = formBuilder.group({
            'access_levels': [null],
            'user_id': [null],
            'client_id': [null],
        });

        this.getAccessLevelData();
        console.log(data);
        this.features = Object.keys(data.services[0]);
        this.featureDetails = data.services[0];
        console.log(this.features);
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
        this.accessLevelsFormSubmit.controls['access_levels'].setValue(this.userFeaturesArray);
        this.accessLevelsFormSubmit.controls['client_id'].setValue(AppConstants.CLIENT_ID);
        this.accessLevelsFormSubmit.controls['user_id'].setValue(localStorage.getItem('user_id'));
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

    configureFeature = (feature: string, index: number) => {

        const feature_id = this.featureDetails[feature][index].feature_id;
        let sub_feature_ids = [];
        let userFeatures;
        const inde = this.userFeaturesArray.findIndex(features => features.feature_id === feature_id);
        if (this.featureDetails[feature][index].has_subfeature) {
            sub_feature_ids = this.featureDetails[feature][index].sub_features.map(item => item.id);
            if (this.featureDetails[feature][index].isEnabled) {
                sub_feature_ids = [];
                this.featureDetails[feature][index].isEnabled = false;
                this.featureDetails[feature][index].sub_features.map(item => item.isEnabled = false);
                if (inde >= 0) {
                    this.userFeaturesArray.splice(inde, 1);
                }
                this.userFeaturesArray = this.userFeaturesArray.filter(userfeature => userfeature.feature_id !== feature_id);
            } else if (!this.featureDetails[feature][index].isEnabled) {
                userFeatures = { feature_id: feature_id, sub_feature_ids: sub_feature_ids };
                if (inde >= 0) {
                    this.userFeaturesArray[inde].sub_feature_ids = sub_feature_ids;
                } else {
                    this.userFeaturesArray = ([...this.userFeaturesArray, userFeatures]);
                }
                this.featureDetails[feature][index].isEnabled = true;
                this.featureDetails[feature][index].sub_features.map(item => {
                    item.isEnabled = true;
                });
            }
        } else {
            if (this.featureDetails[feature][index].isEnabled) {
                this.featureDetails[feature][index].isEnabled = false;
                this.userFeaturesArray = this.userFeaturesArray.filter(userfeature => userfeature.feature_id !== feature_id);
            } else if (!this.featureDetails[feature][index].isEnabled) {
                userFeatures = { feature_id: feature_id, sub_feature_ids: [] };
                this.userFeaturesArray = ([...this.userFeaturesArray, userFeatures]);
                this.featureDetails[feature][index].isEnabled = true;
            }
        }

        console.log(this.userFeaturesArray);
    }
    configureSubFeature = (feature: string, index: number, index2: number, sub_features: ISubFeatures) => {
        let userFeatures;
        const feature_id = sub_features.feature_id;
        const sub_feature_ids = [sub_features.id];
        const inde = this.userFeaturesArray.findIndex(features => features.feature_id === feature_id);
        console.log(inde);
        if (inde >= 0) {
            const subFeatureIndex = this.userFeaturesArray[inde].sub_feature_ids.findIndex(sub_feature => sub_feature === sub_features.id);
            if (subFeatureIndex >= 0) {
                this.userFeaturesArray[inde].sub_feature_ids.splice(subFeatureIndex, 1);
                if (this.featureDetails[feature][index].sub_features.length === this.userFeaturesArray[inde].sub_feature_ids.length) {
                    this.featureDetails[feature][index].isEnabled = true;
                } else {
                    this.featureDetails[feature][index].isEnabled = false;
                }
            } else {
                this.userFeaturesArray[inde].sub_feature_ids = [...this.userFeaturesArray[inde].sub_feature_ids, ...sub_feature_ids];
                if (this.featureDetails[feature][index].sub_features.length === this.userFeaturesArray[inde].sub_feature_ids.length) {
                    this.featureDetails[feature][index].isEnabled = true;
                } else {
                    this.featureDetails[feature][index].isEnabled = false;
                }
            }
        } else {
            userFeatures = { feature_id: feature_id, sub_feature_ids: sub_feature_ids };
            this.userFeaturesArray = [...this.userFeaturesArray, ...userFeatures];
        }
        console.log(this.userFeaturesArray);
        this.featureDetails[feature][index].sub_features[index2].isEnable = true;
    }
}
