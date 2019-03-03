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
    private groupId: string;
    private userId: string;

    constructor(private httpClient: HttpClient, private router: Router) {}

    getUserStatus() {
        return this.userAuthenSubject.asObservable();
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    loginUser(authData: AuthData) {
        this.httpClient.get<ProsAndCons>(BACKEND_URL(authData.groupId, authData.userId))
            .subscribe(
                (data) => {
                    if (data) {
                        this.isAuthenticated = true;
                        this.userAuthenSubject.next(true);
                        this.saveDataInLocalStorage(authData.groupId, authData.userId);
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
        this.removeDataFromLocalStorage();
        this.router.navigate(['/']);
    }

    autoAuth() {
        const authInfo = this.getAuthData();

        if (authInfo) {
            this.groupId = authInfo.groupId;
            this.userId = authInfo.userId;
            this.isAuthenticated = true;
            this.userAuthenSubject.next(true);
        }
    }

    private saveDataInLocalStorage(groupId: string, userId: string) {
        localStorage.setItem('groupId', groupId);
        localStorage.setItem('userId', userId);
    }

    private removeDataFromLocalStorage() {
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
