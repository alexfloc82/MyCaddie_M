import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform, LoadingController, Loading, ActionSheetController } from 'ionic-angular';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Game } from '../../shared/datamodel';

import {GameService} from '../../shared/game.service';

import {ScorecardPage} from '../scorecard/scorecard';
import {NewGamePage} from '../new-game/new-game'

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {

  userGames: Game[];
  loader: Loading;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private gs:GameService,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController
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
        let arrayProm=[]
        games.forEach(game =>{
          arrayProm.push(this.gs.getGame(game.payload.doc.id))
        })
        Promise.all(arrayProm)
        .then(gamecompletes => {
          this.userGames= gamecompletes.sort((a,b)=> (a.date < b.date)?1:-1);
          this.loader.dismiss();
        })
        .catch(err=>console.log(err))        
      }
      );
  }
  
  gameSelected(game:any){
    this.navCtrl.push(ScorecardPage, { game: game });
  }

  newGame(){
    this.navCtrl.push(NewGamePage);
  }

  presentActionSheet(game: Game) {
    let buttons=[];
    buttons.push({
      text: 'Eliminer',
      role: 'destructive',
      icon: !this.platform.is('ios') ? 'trash' : null,
      handler: () => {
        this.afs.collection('games').doc(game['id']).delete().catch(err => console.log(err));
      }
    });

    if(game.isOpen){
      buttons.push({
        text: 'Terminer',
        icon: !this.platform.is('ios') ? 'close-circle' : null,
        handler: () => {
          this.afs.collection('games').doc(game['id']).update({isOpen:false}).catch(err => console.log(err));
        }
      })
    }else{
      buttons.push({
        text: 'Reprendre',
        icon: !this.platform.is('ios') ? 'play' : null,
        handler: () => {
          this.afs.collection('games').doc(game['id']).update({isOpen:true}).catch(err => console.log(err));
        }
      })
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modifiez votre partie',
      buttons: buttons
    });
    actionSheet.present();
  }

  modifyGame(game:any){
    this.navCtrl.push(NewGamePage, {game:game});
  }
  
}
