import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SocketConnectionListenerService {

    // Observable string sources
    private socketConnectionAnnounce = new Subject<string>();

    // Observable string streams
    SockedConnectionAnnounced$ = this.socketConnectionAnnounce.asObservable();

    // Service message commands
    announceMission(connection: string) {
        this.socketConnectionAnnounce.next(connection);
    }
}
