import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

import { User } from '../../shared/datamodel';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { NewContactPage } from '../new-contact/new-contact'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  friends: any[];

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) {
    this.initializeItems();
  }

  initializeItems() {
    
    return new Promise((resolve) => this.afs.collection('users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges().subscribe(user => {
      this.friends = [];
      let promiseArray = [];
      user.friends.forEach(friend => {
        promiseArray.push(firebase.firestore().collection('users').doc(friend.uid).get())
      });
      Promise.all<firebase.firestore.DocumentSnapshot>(promiseArray)
        .then(results => {
          results.forEach(userSnap => this.friends.push(userSnap.data()));
          resolve();
        }
        )
    }))
  }

  getItems(ev) {
    // set val to the value of the ev target
    var val = ev.target.value;
    // Reset items back to all of the items
    this.initializeItems().then(res => {
      if (val && val.trim() != '') {
        this.friends = this.friends.filter((item) => {
          return (item['fullname'].toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }
    );
  }

  newContact(){
    this.navCtrl.push(NewContactPage);
  }

}
