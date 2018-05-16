import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';

import { UserPage } from '../user/user';
import { ContactPage } from '../contact/contact';
import { GamePage } from '../game/game';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { User } from '../../shared/datamodel';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = GamePage;
  tab2Root = UserPage;
  tab3Root = ContactPage;
  isLogged:boolean=false;
  loader: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public loadingCtrl: LoadingController) {
      this.loader = this.loadingCtrl.create({ content: "Please wait..." });
      this.loader.present();
  }

  ionViewDidLoad() {
    if(this.afAuth.auth.currentUser){
      this.isLogged = true;
      this.loader.dismiss();
    }else{
      this.afAuth.auth.getRedirectResult().then((credential) => {
        if (credential.additionalUserInfo){
          if (credential.additionalUserInfo.isNewUser) {
            let profile = credential.additionalUserInfo.profile;
            let user = new User;
            user.uid = credential.user.uid;
            user.fullname = profile.name;
            user.email = profile.email;
            user.locale = profile.locale;
            user.gender = profile.gender;
            user.lastname = profile.family_name;
            user.name = profile.given_name;
            user.picture = profile.picture;
            let newUser = Object.assign({}, user);
            this.afs.collection('users').doc(user.uid).set(newUser).then(a => {
              this.isLogged = true;
              this.loader.dismiss();
            })
          }
          else{
            this.isLogged = true;
            this.loader.dismiss();
          }
        }else{
          this.loader.dismiss();
        }
      });
    }
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    this.afAuth.auth.signInWithRedirect(provider).catch(err => alert(err));
  }

  logout(){
    this.afAuth.auth.signOut().then(res => this.isLogged = false)
  }

  
}
