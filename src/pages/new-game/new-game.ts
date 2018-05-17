import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Game, Course, Facility, User } from '../../shared/datamodel';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';


/**
 * Generated class for the NewGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-game',
  templateUrl: 'new-game.html',
})
export class NewGamePage {

  newGame: Game;
  isNew: boolean;
  courses: Course[];
  firstHole: string;
  clubs: Facility[];
  tab: string = "course";
  currentUserInfo: User;

  friends: any[];

  constructor(
    public navCtrl: NavController,
    public NavPrms: NavParams,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore, ) {

    if (this.NavPrms.get('game')) {
      this.newGame = new Game;
      let currentGame = this.NavPrms.get('game');
      this.newGame.id = currentGame.id;
      this.newGame.club = currentGame.club;
      this.newGame.course = currentGame.course;
      this.newGame.currentHole = currentGame.currentHole;
      this.newGame.date = currentGame.date;
      this.newGame.formula = currentGame.formula;
      this.newGame.isOpen = currentGame.isOpen;
      this.newGame.participants = currentGame.participants;
      this.newGame.participants.forEach(part => this.newGame[part] = true);
      this.isNew = false;
      
    } else {
      this.newGame = new Game;
      this.newGame.formula = "A";
      this.newGame.participants.push(this.afAuth.auth.currentUser.uid);
      this.newGame[this.afAuth.auth.currentUser.uid]=true;
      this.isNew = true;
    }
    this.afs.collection<Facility>('clubs').valueChanges().subscribe(clubs => this.clubs = clubs);
    this.afs.collection('users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges().subscribe(user => {
      this.currentUserInfo = user;
      this.initializeItems();

    });

  }

  ionViewDidLoad() {
    this.onClubSelect();
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

  save() {
    let newGame = Object.assign({}, this.newGame);
    newGame.participants.forEach(part => newGame[part] = true);
    if (this.isNew) {
      newGame.currentHole = this.firstHole;
      this.afs.collection('games').add(newGame).then(a => {
        this.afs.collection('games').doc(a.id).update({ id: a.id }).then(v => this.navCtrl.pop())
      })
    } else {
      this.afs.collection('games').doc(newGame['id']).set(newGame).then(v => this.navCtrl.pop());
    }

  }

  onClubSelect() {
    if(this.newGame.club){
      this.afs.collection<Facility>('clubs').doc(this.newGame.club).collection<Course>('courses', quer => quer.orderBy('name'))
      .valueChanges().subscribe(courses => {
        this.courses = courses;
        this.newGame.course = courses[0].courseId;
        this.firstHole = courses[0].holes[0]['holeId'];
      });
    }

  }

  onCourseSelect() {
    this.afs.collection<Facility>('clubs').doc(this.newGame.club).collection('courses').doc<Course>(this.newGame.course)
      .valueChanges().subscribe(course => this.firstHole = course.holes[0]['holeId']);
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

  togglePlayer(frienduid:string){

    if(!this.newGame[frienduid]){
      this.newGame.participants.push(frienduid);
      this.newGame[frienduid] = true;
    }else{
      this.newGame.participants = this.newGame.participants.filter(value => value !== frienduid);
      this.newGame[frienduid] = false;
    }


  }

}
