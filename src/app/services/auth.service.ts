import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore
    ) { }

  initAuthListener(): void {
    this.auth.authState.subscribe((fuser: firebase.default.User) => {
      console.log(fuser);
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
