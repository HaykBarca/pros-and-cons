import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';
import { ProsAndCons } from '../model/pros-and-cons.model';

const BACKEND_URL = function (groupId, userId) {
    return `https://avetiq-test.firebaseapp.com/proscons/group/${groupId}/user/${userId}`;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = false;
    private userAuthenSubject = new Subject<boolean>();

    constructor(private httpClient: HttpClient, private router: Router) {}

    getUserStatus() {
        return this.userAuthenSubject.asObservable();
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    loginUser(groupId: string, userId: string) {
        this.httpClient.get<ProsAndCons>(BACKEND_URL(groupId, userId))
            .subscribe(
                (data) => {
                    if (data) {
                        this.isAuthenticated = true;
                        this.userAuthenSubject.next(true);
                        this.saveDataInLocalStorage(groupId, userId);
                        this.router.navigate(['/home']);
                    }
                },
                (error) => {
                    this.userAuthenSubject.next(false);
                }
            );
    }

    logoutUser() {
        this.isAuthenticated = false;
        this.userAuthenSubject.next(false);
        this.removeTokenFromLocalStorage();
        this.router.navigate(['/']);
    }

    autoAuth() {
        // const authInfo = this.getAuthData();

        // if (authInfo) {
        //     this.token = authInfo.token;
        //     this.isAuthenticated = true;
        //     this.userAuthenSubject.next(true);
        // }
    }

    private saveDataInLocalStorage(groupId: string, userId: string) {
        localStorage.setItem('groupId', groupId);
        localStorage.setItem('userId', userId);
    }

    private removeTokenFromLocalStorage() {
        localStorage.removeItem('groupId');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const groupId = localStorage.getItem('groupId');
        const userId = localStorage.getItem('userId');

        if (!groupId || !userId) {
            return;
        }

        return {groupId, userId};
    }
}
