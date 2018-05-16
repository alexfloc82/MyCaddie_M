import { Component } from '@angular/core';
import { NavController,LoadingController, Loading, } from 'ionic-angular';

import { User } from '../../shared/datamodel';
import { AngularFirestore} from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  tab:string="perso";
  user:User;
  loader: Loading;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) {
      this.loader = this.loadingCtrl.create({ content: "Please wait..." });
      this.loader.present();
      this.afs.collection('users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges().subscribe(user => 
        {
          this.user=user;
          this.loader.dismiss();
        })
  }


  save() {
    this.afs.collection('users').doc(this.user.uid).set(this.user).then(a => {
    })

  }

}
