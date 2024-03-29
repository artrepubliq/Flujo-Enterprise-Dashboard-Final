import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';



@Injectable()
export class ChatHttpApiService {
    constructor(private httpClient: HttpClient) {

    }

    getChatConvesationByConversationId = (object): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.httpClient.post(AppConstants.SOCEKT_API_URL + '/conversations', object).subscribe(
                succRes => {
                    resolve(succRes);
                },
                errResp => {
                    reject(errResp);
                }
            );
        });
    }
}
