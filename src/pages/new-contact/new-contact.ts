import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';

import { User } from '../../shared/datamodel';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the NewContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-contact',
  templateUrl: 'new-contact.html',
})
export class NewContactPage {

  friends: User[];

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public alertCtrl: AlertController) {
    this.initializeItems().subscribe(res => this.friends = res);
  }

  initializeItems() {
    return this.afs.collection<User>('users').valueChanges()
  }

  getItems(ev) {
    // set val to the value of the ev target
    var val = ev.target.value;
    // Reset items back to all of the items
    this.initializeItems().subscribe(res => {
      this.friends = res;
      if (val && val.trim() != '') {
        this.friends = this.friends.filter((item) => {
          return (item['fullname'].toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }
    );
  }

  showConfirm(user:User) {
    let confirm = this.alertCtrl.create({
      title: 'Voulez-vous ajouter à vos contacts?',
      message: 'Une demande de confirmation sera envoyée',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'D\'accord',
          handler: () => {
           let subscription =  this.afs.collection('users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges().subscribe(currUser =>{
              if(!this.isAlreadyFriend(currUser, user)){
                currUser.friends.push({uid:user.uid, isAccepted:false});
                this.afs.collection('users').doc<User>(this.afAuth.auth.currentUser.uid)
                .update({friends:currUser.friends}).then(res => {
                  this.navCtrl.pop();
                  subscription.unsubscribe();
                })
              }
            })
          }
        }
      ]
    });
    confirm.present();
  }

  isAlreadyFriend(user:User, friend:User){
    let isFriend= false;
    user.friends.forEach(userFriend =>{
      if(userFriend.uid == friend.uid){
        isFriend = true;
      }
    })
    return isFriend;
  }

}
