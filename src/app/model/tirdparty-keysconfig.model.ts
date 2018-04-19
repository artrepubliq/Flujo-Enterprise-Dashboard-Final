export interface ITPKeysConfig {
    client_id: string;
    source_name: string;
    source_keys: ISocialKeys;
    thirdparty_id?: string;
    id?: string;
}

export interface ISocialKeys {
    /** this is for facebook access keys */
    fbappid?: string;
    fbappversion?: string;
    /* this is for twitter access keys */
    twaccesssecret?: string;
    twaccesstoken?: string;
    twconsumerkey?: string;
    twconsumersecret?: string;
    /** this is for whatsapp*/
    whatsappclientid?: string;
    whatsappclientphonenumber?: string;
    whatsappclientsecret?: string;
    whatsappinstaceid?: string;
    /** this is for chat camp keys */
    ccappid?: string;
    ccappkey?: string;
}
