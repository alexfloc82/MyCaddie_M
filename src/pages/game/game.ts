import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Game } from '../../shared/datamodel';

import {GameService} from '../../shared/game.service';

import {ScorecardPage} from '../scorecard/scorecard';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {

  userGames: Game[];
  loader: Loading;

  constructor(
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private gs:GameService,
    public loadingCtrl: LoadingController
  ) {
    this.loader = this.loadingCtrl.create({content: "Please wait..."});
    this.loader.present();
  }

  ionViewDidLoad() {
    this.afs
      .collection<Game>('games', query => query.where(this.afAuth.auth.currentUser.uid, '==', true).limit(10))
      .snapshotChanges()
      .subscribe(games => {
        this.userGames=[];
        games.forEach(game =>{
          this.gs.getGame(game.payload.doc.id).then(gamecomplete => this.userGames.push(gamecomplete))
        })
        this.loader.dismiss();
      }
      );
  }
  
  gameSelected(game:any){
    this.navCtrl.push(ScorecardPage, { game: game });
  }
  
}
