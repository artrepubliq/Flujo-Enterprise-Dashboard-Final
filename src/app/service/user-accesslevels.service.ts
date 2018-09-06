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
    const  finalFilteredObject = this.removeDissabledObjects(clientFeatures,  clientFeatures.services[0]);
    return finalFilteredObject;
  }

  addExitingUserSubfeatures = (serviceName: string, services: Iservices, features: Ifeatures[], userFeatures: IUserFeatures[]) => {
    if (services) {
      services[serviceName].map((item, index) => {
        let current_feature_id: any;
        let current_subfeatures: any;
        const isfeatureAvailable = userFeatures.some((userfeatureItem, userFeatureIndex) => {
          if (userfeatureItem.feature_id === item.feature_id) {
            current_feature_id = userfeatureItem.feature_id;
            current_subfeatures = userfeatureItem.sub_feature_ids;
          }
          return userfeatureItem.feature_id === item.feature_id;
        });
        if (isfeatureAvailable) {
          BASE_ROUTER_CONFIG[`F_${current_feature_id}`].id = services[serviceName][index].feature_id;
          BASE_ROUTER_CONFIG[`F_${current_feature_id}`].title = services[serviceName][index].feature_name;
          BASE_ROUTER_CONFIG[`F_${current_feature_id}`].token = services[serviceName][index].feature_access_token;
          const subFeatures: any[] = features.filter(subfeature => item.feature_id === subfeature.feature_id);
          const userSubFeatures = [];
          current_subfeatures.forEach((userSubFeaItem) => {
            subFeatures.map((clientSubFeaItem) => {
              if (clientSubFeaItem.id === userSubFeaItem) {
                if (BASE_ROUTER_CONFIG[`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`]) {
                BASE_ROUTER_CONFIG[`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`].id = clientSubFeaItem.subfeature_id;
                BASE_ROUTER_CONFIG[`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`].title = clientSubFeaItem.subfeature_name;
                BASE_ROUTER_CONFIG[`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`].token = clientSubFeaItem.sf_token;
                }
                userSubFeatures.push(clientSubFeaItem);
              }
            });
          });
          services[serviceName][index].isActive = false;
          services[serviceName][index].isEnabled = true;
          if (userSubFeatures.length > 0) {
            services[serviceName][index].has_subfeature = true;
            services[serviceName][index].sub_features = userSubFeatures;
          }
        } else {
          console.log(index);
          services[serviceName][index] = {'isEnabled': false};
          // services[serviceName].splice(index, 1);
        }

      });
      return services[serviceName];
    }
  }

  removeDissabledObjects(clientFeatures, services) {
    Object.keys(clientFeatures.services[0]).map(service => {
      const enabledFeatures = services[service].filter((item, index) => {
        return item.isEnabled === true;
      });
      if (enabledFeatures.length > 0) {
        clientFeatures.services[0][service] = enabledFeatures;
      } else {
        delete clientFeatures.services[0][service];
      }
    });
    return clientFeatures;
  }
}
