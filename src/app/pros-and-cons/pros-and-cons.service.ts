import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { ProsAndCons } from '../model/pros-and-cons.model';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = function (groupId, userId) {
    return `https://avetiq-test.firebaseapp.com/proscons/group/${groupId}/user/${userId}`;
};

@Injectable({
    providedIn: 'root'
})
export class ProsAndConsService {
    private prosAndCons: ProsAndCons;
    private prosAndConsUpdated = new Subject<{prosAndCons: ProsAndCons}>();

    constructor (private httpClient: HttpClient,
                 private authService: AuthService,
                 private router: Router) {}

    getProsAndCons() {
        this.httpClient.get<ProsAndCons>(BACKEND_URL(localStorage.getItem('groupId'), localStorage.getItem('userId')))
            .subscribe(data => {
                this.prosAndCons = data;
                this.prosAndConsUpdated.next({prosAndCons: this.prosAndCons});
            });
    }

    getProsAndConsUpdatedListener() {
        return this.prosAndConsUpdated.asObservable();
    }

    addPros(pro: string) {
        this.prosAndCons.pros.push(pro);
        this.putRequest();
    }

    addCons(con: string) {
        this.prosAndCons.cons.push(con);
        this.putRequest();
    }

    updatePro(pro: string, index: number) {
        this.prosAndCons.pros.splice(index, 1, pro);
        this.putRequest();
    }

    updateCon(con: string, index: number) {
        this.prosAndCons.cons.splice(index, 1, con);
        this.putRequest();
    }

    deletePros(index: number) {
        this.prosAndCons.pros.splice(index, 1);
        this.putRequest();
    }

    deleteCons(index: number) {
        this.prosAndCons.cons.splice(index, 1);
        this.putRequest();
    }

    putRequest() {
        this.httpClient.put<ProsAndCons>(BACKEND_URL(localStorage.getItem('groupId'), localStorage.getItem('userId')), this.prosAndCons)
            .subscribe(data => {
                this.prosAndCons = data;
                this.prosAndConsUpdated.next({prosAndCons: this.prosAndCons});
            });
    }
}
