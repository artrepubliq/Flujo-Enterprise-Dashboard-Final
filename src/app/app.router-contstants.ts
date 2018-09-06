interface IFeature {
    id: any;
    title: any;
    token: any;
}
interface BaseURLConfig {

    // THESE ARE MAIN FEATURES.
    F_1: IFeature; // SINGLE EDITOR
    F_2: IFeature; // MULTI EDITOR
    F_3: IFeature;  // SOCIAL
    F_4: IFeature;  // EMAIL
    F_5: IFeature;  // SMS
    F_6: IFeature; // WHATS APP
    F_7: IFeature; // SERVAYS
    F_8: IFeature; // ANALYTICS
    F_9: IFeature; // DRIVE
    F_10: IFeature; // TEAM
    F_11: IFeature; // BASIC INFO
    F_12: IFeature; // DOMAIN

    // THESE ARE SUB FEATURES FOR MULTI EDITOR.
    F_2_SF_1: IFeature;
    F_2_SF_2: IFeature;
    F_2_SF_3: IFeature;
    F_2_SF_4: IFeature;
    F_2_SF_5: IFeature;
    F_2_SF_6: IFeature;
    F_2_SF_7: IFeature;
    F_2_SF_8: IFeature;
    F_2_SF_9: IFeature;
    F_2_SF_10: IFeature;
    F_2_SF_11: IFeature;
    F_2_SF_12: IFeature;
    F_2_SF_13: IFeature;
    F_2_SF_14: IFeature;
    F_2_SF_15: IFeature;
    F_2_SF_16: IFeature;

    F_3_SF_1: IFeature;
    F_3_SF_2: IFeature;
    // EMAIL
    F_4_SF_1: IFeature;
    F_4_SF_2: IFeature;
    // SMS
    F_5_SF_1: IFeature;
    F_5_SF_2: IFeature;

    F_6_SF_1: IFeature;

    F_8_SF_1: IFeature;

    F_9_SF_1: IFeature;

    F_10_SF_1: IFeature;

    // BASIC FEATURES
    F_11_SF_1: IFeature;
    F_11_SF_2: IFeature;
    F_11_SF_3: IFeature;
    F_11_SF_4: IFeature;
    F_11_SF_5: IFeature;
  }
//  interface IF_3SubFeatures {
//       SF_
//   }
  export const BASE_ROUTER_CONFIG: BaseURLConfig = {
      F_1: <IFeature>{},
      F_2: <IFeature>{},
      F_3: <IFeature>{},
      F_4: <IFeature>{},
      F_5: <IFeature>{},
      F_6: <IFeature>{},
      F_7: <IFeature>{},
      F_8: <IFeature>{},
      F_9: <IFeature>{},
      F_10: <IFeature>{},
      F_11: <IFeature>{},
      F_12: <IFeature>{},

    F_2_SF_1: <IFeature>{},
    F_2_SF_2: <IFeature>{},
    F_2_SF_3: <IFeature>{},
    F_2_SF_4: <IFeature>{},
    F_2_SF_5: <IFeature>{},
    F_2_SF_6: <IFeature>{},
    F_2_SF_7: <IFeature>{},
    F_2_SF_8: <IFeature>{},
    F_2_SF_9: <IFeature>{},
    F_2_SF_10: <IFeature>{},
    F_2_SF_11: <IFeature>{},
    F_2_SF_12: <IFeature>{},
    F_2_SF_13: <IFeature>{},
    F_2_SF_14: <IFeature>{},
    F_2_SF_15: <IFeature>{},
    F_2_SF_16: <IFeature>{},

    F_3_SF_1: <IFeature>{},
    F_3_SF_2: <IFeature>{},

    F_4_SF_1: <IFeature>{},
    F_4_SF_2: <IFeature>{},

    F_5_SF_1: <IFeature>{},
    F_5_SF_2: <IFeature>{},

    F_6_SF_1: <IFeature>{},

    F_8_SF_1: <IFeature>{},

    F_9_SF_1: <IFeature>{},

    F_10_SF_1: <IFeature>{},

    F_11_SF_1: <IFeature>{},
    F_11_SF_2: <IFeature>{},
    F_11_SF_3: <IFeature>{},
    F_11_SF_4: <IFeature>{},
    F_11_SF_5: <IFeature>{},

  };
