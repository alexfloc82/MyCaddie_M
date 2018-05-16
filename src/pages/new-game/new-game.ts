import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Game, Course, Facility, User } from '../../shared/datamodel';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';


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
      this.isNew = false;
      
    } else {
      this.newGame = new Game;
      this.newGame.formula = "A";
      this.newGame.participants.push(this.afAuth.auth.currentUser.uid);
      this.isNew = true;
    }
    this.afs.collection<Facility>('clubs').valueChanges().subscribe(clubs => this.clubs = clubs);
    this.afs.collection('users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges().subscribe(user => this.currentUserInfo = user);

  }

  ionViewDidLoad() {
    this.onClubSelect();
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
      this.afs.collection('games').doc(newGame['id']).set(newGame);
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

}
