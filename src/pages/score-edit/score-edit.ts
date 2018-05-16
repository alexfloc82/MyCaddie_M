import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import {  Hole, User } from '../../shared/datamodel';

import { GameService } from '../../shared/game.service';

/**
 * Generated class for the ScoreEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-score-edit',
  templateUrl: 'score-edit.html',
})
export class ScoreEditPage {
  hole: Hole;
  game: any;

  participant: User;
  selectedScore: any;

  constructor(public navCtrl: ViewController, public navParams: NavParams, private gs: GameService, ) {
    this.game = this.navParams.get('game');
    this.hole = this.navParams.get('hole');
    this.participant = this.navParams.get('participant');

  }

  save() {
    if(Number(this.selectedScore) > 0){
      this.gs.saveScore(this.game.id, this.hole.holeId, this.participant.uid, Number(this.selectedScore), true).then(res => this.navCtrl.dismiss());
    }
  }

}
