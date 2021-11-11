import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  get user() {
    return this._user;
  }

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
    ) { }

  initAuthListener(): void {
    this.auth.authState.subscribe((fuser: firebase.default.User) => {
      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe((firestoreUser: any) => {
          const user = Usuario.fromFirebase(firestoreUser);
          this._user = user;
          this.store.dispatch(authActions.setUser({user}));
        });
      } else {
        // no existe
        this._user = null;
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
        this.store.dispatch(authActions.unsetUser());
        this.store.dispatch( ingresoEgresoActions.unSetItems() );
      }
    });
  }

  isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(fbUser => fbUser !== null)
    );
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password).then(({user}) => {
      const newUser = new Usuario(user.uid, nombre, user.email);
      return this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
    });
  }

  loginUsuario(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }
}
