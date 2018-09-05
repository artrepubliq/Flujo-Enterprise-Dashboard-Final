import { Injectable } from '@angular/core';
import { IUserAccessLevels, Ifeatures, Iservices, IUserFeatures } from '../model/user-accesslevels.model';
import { BASE_ROUTER_CONFIG } from '../app.router-contstants';

@Injectable()
export class UserAccesslevelsService {

  constructor() { }

  prepareUserAccessLevels = (inputObject: IUserAccessLevels) => {
    Object.keys(inputObject.services[0]).map(service => {
      const obj = this.addSubfeatures(service, inputObject.services[0], inputObject.features);
      inputObject.services[0][service] = obj;
    });
    return inputObject;
  }

  addSubfeatures = (serviceName: string, services: Iservices, features: Ifeatures[]) => {
    if (services) {
      services[serviceName].map((item, index) => {
        const subFeatures: any[] = features.filter(subfeature => item.feature_id === subfeature.feature_id);
        if (subFeatures.length > 0) {
          services[serviceName][index].has_subfeature = true;
          services[serviceName][index].sub_features = subFeatures;
        }
      });
      return services[serviceName];
    }
  }



  // CREATE ALREADY EXISTED USED OBJECT
  prepareExistingUserAccessLevels = (clientFeatures: IUserAccessLevels, userFeatures: IUserFeatures[]) => {
    Object.keys(clientFeatures.services[0]).map(service => {
      const obj = this.addExitingUserSubfeatures(service, clientFeatures.services[0], clientFeatures.features, userFeatures);
      console.log(obj);
      if (obj.length > 0) {
        clientFeatures.services[0][service] = obj;
      } else {
        delete clientFeatures.services[0][service];
      }
    });
    console.log(clientFeatures);
    console.log(BASE_ROUTER_CONFIG);
    return clientFeatures;
  }

  addExitingUserSubfeatures = (serviceName: string, services: Iservices, features: Ifeatures[], userFeatures: IUserFeatures[]) => {
    if (services) {
      services[serviceName].map((item, index) => {
        let userFeatureIndexTofindSubFeature: any;
        const isfeatureAvailable = userFeatures.some((userfeatureItem, userFeatureIndex) => {
          if (userfeatureItem.feature_id === item.feature_id) {
            userFeatureIndexTofindSubFeature = userFeatureIndex;
          }
          return userfeatureItem.feature_id === item.feature_id;
        });
        if (isfeatureAvailable) {
          // tslint:disable-next-line:max-line-length
          BASE_ROUTER_CONFIG[`F_${userFeatures[userFeatureIndexTofindSubFeature].feature_id}`].id = services[serviceName][index].feature_id;
          // tslint:disable-next-line:max-line-length
          BASE_ROUTER_CONFIG[`F_${userFeatures[userFeatureIndexTofindSubFeature].feature_id}`].title = services[serviceName][index].feature_name;
          // tslint:disable-next-line:max-line-length
          BASE_ROUTER_CONFIG[`F_${userFeatures[userFeatureIndexTofindSubFeature].feature_id}`].token = services[serviceName][index].feature_access_token;
          const subFeatures: any[] = features.filter(subfeature => item.feature_id === subfeature.feature_id);
          const userSubFeatures = [];
          userFeatures[userFeatureIndexTofindSubFeature].sub_feature_ids.forEach((userSubFeaItem) => {
            subFeatures.map((clientSubFeaItem) => {
              if (clientSubFeaItem.id === userSubFeaItem) {
                // tslint:disable-next-line:max-line-length
                if (BASE_ROUTER_CONFIG[`F_${userFeatures[userFeatureIndexTofindSubFeature].feature_id}_${clientSubFeaItem.subfeature_id}`]) {
                  // tslint:disable-next-line:max-line-length
                BASE_ROUTER_CONFIG[`F_${userFeatures[userFeatureIndexTofindSubFeature].feature_id}_${clientSubFeaItem.subfeature_id}`].id = clientSubFeaItem.subfeature_id;
                // tslint:disable-next-line:max-line-length
                BASE_ROUTER_CONFIG[`F_${userFeatures[userFeatureIndexTofindSubFeature].feature_id}_${clientSubFeaItem.subfeature_id}`].title = clientSubFeaItem.subfeature_name;
                // tslint:disable-next-line:max-line-length
                BASE_ROUTER_CONFIG[`F_${userFeatures[userFeatureIndexTofindSubFeature].feature_id}_${clientSubFeaItem.subfeature_id}`].token = clientSubFeaItem.sf_token;
                }
                userSubFeatures.push(clientSubFeaItem);
              }
            });
          });
          if (userSubFeatures.length > 0) {
            services[serviceName][index].has_subfeature = true;
            services[serviceName][index].isActive = false;
            services[serviceName][index].sub_features = userSubFeatures;
          }
        } else {
          // services[serviceName][index].has_feature = false;
          services[serviceName].splice(index, 1);
          // delete services[serviceName][index];
        }

      });
      return services[serviceName];
    }
  }
}
