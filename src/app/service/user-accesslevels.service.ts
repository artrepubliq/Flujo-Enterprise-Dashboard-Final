import { Injectable } from '@angular/core';
import { IUserAccessLevels, Ifeatures, Iservices, IUserFeatures, ISubFeatures } from '../model/user-accesslevels.model';
import { BASE_ROUTER_CONFIG } from '../app.router-contstants';
import { Router } from '@angular/router';

@Injectable()
export class UserAccesslevelsService {
  allSubFeatures =  [];
  constructor(private router: Router) { }

  prepareUserAccessLevels = (userFeatures: IUserFeatures, clientFeatures: IUserAccessLevels) => {
    Object.keys(clientFeatures.services[0]).map(service => {
      const obj = this.addSubfeatures(service, clientFeatures.services[0], clientFeatures.features, userFeatures);
      clientFeatures.services[0][service] = obj;
    });
    return clientFeatures;
  }

  addSubfeatures = (serviceName: string, services: Iservices, features: Ifeatures[], userFeatures) => {
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
          const totalAvailableUserSubfeatures = [];
          const subFeatures: any[] = features.filter(subfeature => item.feature_id === subfeature.feature_id);
          // current_subfeatures.forEach((userSubFeaItem) => {
            subFeatures.map((clientSubFeaItem: ISubFeatures, itemindex) => {
              // tslint:disable-next-line:max-line-length
              const isSubFeatureEnabled = current_subfeatures.some( (subFeatureItem) => {
                if (subFeatureItem === clientSubFeaItem.subfeature_id) {
                  totalAvailableUserSubfeatures.push(clientSubFeaItem);
                  subFeatures[itemindex].isEnabled = true;
                }
              });
              // if (isSubFeatureEnabled) {
              //   subFeatures[itemindex].isEnabled = true;
              // } else {
              //   subFeatures[itemindex].isEnabled = false;
              // }


              // if (clientSubFeaItem.subfeature_id === `SF_${userSubFeaItem}`) {
              //   test.push(`SF_${userSubFeaItem}`);
              //   subFeatures[itemindex].isEnabled = true;
              // }
            });
          // });
          subFeatures.map((itemtoaddFalse: ISubFeatures, falseindex) => {
            if (!itemtoaddFalse.isEnabled) {
              subFeatures[falseindex].isEnabled = false;
            }
          });
          services[serviceName][index].isActive = false;
          if (totalAvailableUserSubfeatures.length === subFeatures.length) {
            services[serviceName][index].isEnabled = true;
          } else {
            services[serviceName][index].isEnabled = false;
          }
          if (subFeatures.length > 0) {
            services[serviceName][index].has_subfeature = true;
            services[serviceName][index].sub_features = subFeatures;
          }
        } else {
          const dissabledsubFeatures: any[] = features.filter((subfeature) => {
            if ( item.feature_id === subfeature.feature_id) {
              return subfeature;
            }
          });
          dissabledsubFeatures.map(disabledItem => {
            disabledItem.isEnabled = false;
          });
          if (dissabledsubFeatures.length > 0) {
            services[serviceName][index].has_subfeature = true;
            services[serviceName][index].isEnabled = false;
            services[serviceName][index].sub_features = dissabledsubFeatures;
          }
        }

      });
      return services[serviceName];
    }
    // if (services) {
    //   services[serviceName].map((item, index) => {
    //     const subFeatures: any[] = features.filter(subfeature => item.feature_id === subfeature.feature_id);
    //     if (subFeatures.length > 0) {
    //       services[serviceName][index].has_subfeature = true;
    //       services[serviceName][index].sub_features = subFeatures;
    //     }
    //   });
    //   return services[serviceName];
    // }
  }



  // CREATE ALREADY EXISTED USED OBJECT
  prepareExistingUserAccessLevels = (clientFeatures: IUserAccessLevels, userFeatures: IUserFeatures[]) => {
    const adminRouterIndex = this.router.config.findIndex(item => item.path === 'admin');
    Object.keys(clientFeatures.services[0]).map(service => {
      // tslint:disable-next-line:max-line-length
      const obj = this.addExitingUserSubfeatures(service, clientFeatures.services[0], clientFeatures.features, userFeatures, adminRouterIndex);
      if (obj.length > 0) {
        clientFeatures.services[0][service] = obj;
      } else {
        delete clientFeatures.services[0][service];
      }
    });
    const  finalFilteredObject = this.removeDissabledObjects(clientFeatures,  clientFeatures.services[0]);
    const filteredObj =  {filterFeatures: finalFilteredObject, filteredSubFeatures: this.allSubFeatures};
    return filteredObj;
  }

  // tslint:disable-next-line:max-line-length
  addExitingUserSubfeatures = (serviceName: string, services: Iservices, features: Ifeatures[], userFeatures: IUserFeatures[], adminRouterIndex) => {
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
          this.configFeatureRouter(`F_${current_feature_id}`, services[serviceName][index], adminRouterIndex);
          BASE_ROUTER_CONFIG[`F_${current_feature_id}`].id = services[serviceName][index].feature_id;
          BASE_ROUTER_CONFIG[`F_${current_feature_id}`].title = services[serviceName][index].feature_name;
          BASE_ROUTER_CONFIG[`F_${current_feature_id}`].token = services[serviceName][index].feature_route;
          const subFeatures: any[] = features.filter(subfeature => item.feature_id === subfeature.feature_id);
          const userSubFeatures = [];
          current_subfeatures.forEach((userSubFeaItem) => {
            subFeatures.map((clientSubFeaItem) => {
              if (clientSubFeaItem.subfeature_id === userSubFeaItem) {
                if (BASE_ROUTER_CONFIG[`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`]) {
                  // tslint:disable-next-line:max-line-length
                  this.configFeatureRouter(`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`, clientSubFeaItem, adminRouterIndex);
                BASE_ROUTER_CONFIG[`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`].id = clientSubFeaItem.subfeature_id;
                BASE_ROUTER_CONFIG[`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`].title = clientSubFeaItem.subfeature_name;
                BASE_ROUTER_CONFIG[`F_${current_feature_id}_${clientSubFeaItem.subfeature_id}`].token = clientSubFeaItem.subfeature_route;
                }
                this.allSubFeatures.push(clientSubFeaItem);
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

  configFeatureRouter = (featureId, featureDetails, adminRouterIndex) => {
      const routerIndex = this.router.config[adminRouterIndex].children[0].children.findIndex(router => router.path === featureId);
      if ( routerIndex >= 0) {
        if (featureDetails.feature_route) {
          this.router.config[adminRouterIndex].children[0].children[routerIndex].path = featureDetails.feature_route;
          this.router.config[adminRouterIndex].children[0].children[routerIndex].data.title = featureDetails.feature_name;
        } else {
          this.router.config[adminRouterIndex].children[0].children[routerIndex].path = featureDetails.subfeature_route;
          this.router.config[adminRouterIndex].children[0].children[routerIndex].data.title = featureDetails.subfeature_name;
        }
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
