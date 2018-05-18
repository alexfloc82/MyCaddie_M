import { Component } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { GameService } from '../../shared/game.service';

import { User, Hole } from '../../shared/datamodel';

import { ScoreEditPage } from '../score-edit/score-edit';

/**
 * Generated class for the ScorecardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scorecard',
  templateUrl: 'scorecard.html',
})
export class ScorecardPage {

  game: any;
  scores: any[];
  loader: Loading;

  total: any;
  totalBrut: any;
  totalNet: any;
  parTotal: number;

  totali: any;
  totaliBrut: any;
  totaliNet: any;
  parTotali: number;

  totalo: any;
  totaloBrut: any;
  totaloNet: any;
  parTotalo: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private gs: GameService,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController) {



    this.loader = this.loadingCtrl.create({ content: "Please wait..." });
    this.total = {};
    this.totalBrut = {};
    this.totalNet = {};

    this.totali = {};
    this.totaliBrut = {};
    this.totaliNet = {};

    this.totalo = {};
    this.totaloBrut = {};
    this.totaloNet = {};


    this.loader.present();
    this.game = this.navParams.data.game;
    Promise.all([
      this.gs.getParticipantsDetail(this.game.participants),
      this.gs.getHolesDetail(this.game.club, this.game.courseComplete.holes)
    ]).then((result) => {
      this.game.participantsComplete = result[0];
      this.game.courseComplete.holesComplete = result[1];
      this.calculateTotal();
      this.loader.dismiss();
    })
  }

  ionViewDidLoad() {

  }

  calculateTotal() {

    this.parTotal = 0;
    this.parTotali = 0;
    this.parTotalo = 0;
    this.game.courseComplete.holes.forEach((hole, index) => {
      if (hole.detail.par) {
        this.parTotal = this.parTotal + hole.detail.par;

        if (index < 9) {
          this.parTotali = this.parTotali + hole.detail.par;
        }
        if (index >= 9) {
          this.parTotalo = this.parTotalo + hole.detail.par;
        }
      }
    });

    this.game.participantsComplete.forEach(participant => {
      this.total[participant['uid']] = 0;
      this.totalBrut[participant['uid']] = 0;
      this.totalNet[participant['uid']] = 0;

      this.totali[participant['uid']] = 0;
      this.totaliBrut[participant['uid']] = 0;
      this.totaliNet[participant['uid']] = 0;

      this.totalo[participant['uid']] = 0;
      this.totaloBrut[participant['uid']] = 0;
      this.totaloNet[participant['uid']] = 0;

      this.game.courseComplete.holesComplete.forEach((hole, index) => {
        if (this.game['scores'][hole.detail.holeId]) {
          if (this.game['scores'][hole.detail.holeId][participant['uid']]) {
            this.total[participant['uid']] = this.total[participant['uid']] + this.game['scores'][hole.detail.holeId][participant['uid']];
            this.totalNet[participant['uid']] = this.totalNet[participant['uid']] + this.calculateNetPoints(hole.handicap, participant, hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
            this.totalBrut[participant['uid']] = this.totalBrut[participant['uid']] + this.calculateGrossPoints(hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);

            if (index < 9) {
              this.totali[participant['uid']] = this.totali[participant['uid']] + this.game['scores'][hole.detail.holeId][participant['uid']];
              this.totaliNet[participant['uid']] = this.totaliNet[participant['uid']] + this.calculateNetPoints(hole.handicap, participant, hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
              this.totaliBrut[participant['uid']] = this.totaliBrut[participant['uid']] + this.calculateGrossPoints(hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
            }
            if (index >= 9) {
              this.totalo[participant['uid']] = this.totalo[participant['uid']] + this.game['scores'][hole.detail.holeId][participant['uid']];
              this.totaloNet[participant['uid']] = this.totaloNet[participant['uid']] + this.calculateNetPoints(hole.handicap, participant, hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
              this.totaloBrut[participant['uid']] = this.totaloBrut[participant['uid']] + this.calculateGrossPoints(hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
            }
          }
        }
      });
    });


  }

  calculateNetPoints(holeh: number, participant: User, holePar: number, playerScore: number) {
    let playerh = participant.handicap;
    let playert = participant.tees;
    let playerg = participant.gender;
    let playerhcourse: number;
    let sss: number;
    let slope: number;
    if (playerScore) {
      if (playerg == "male") {
        switch (playert) {
          case "B":
            slope = this.game.courseComplete.slope_MB;
            sss = this.game.courseComplete.sss_MB;
            break;
          case "Y":
            slope = this.game.courseComplete.slope_MY;
            sss = this.game.courseComplete.sss_MY;
            break;
          case "Bl":
            slope = this.game.courseComplete.slope_MBl;
            sss = this.game.courseComplete.sss_MBl;
            break;
          case "R":
            slope = this.game.courseComplete.slope_MR;
            sss = this.game.courseComplete.sss_MR;
            break;

          default:
            break;
        }
      }
      else {
        switch (playert) {
          case "Y":
            slope = this.game.courseComplete.slope_FY;
            sss = this.game.courseComplete.sss_FY;
            break;
          case "Bl":
            slope = this.game.courseComplete.slope_FBl;
            sss = this.game.courseComplete.sss_FBl;
            break;
          case "R":
            slope = this.game.courseComplete.slope_FR;
            sss = this.game.courseComplete.sss_FR;
            break;

          default:
            break;
        }
      }

      playerhcourse = Math.ceil((playerh * slope) / 113 + (sss - this.parTotal));


      let CR = 0;
      if (playerhcourse <= 18) {
        if (holeh <= playerhcourse) {
          CR = 1;
        }
      } else {
        if (holeh <= playerhcourse - 18) {
          CR = 2;
        } else {
          CR = 1;
        }
      }
      return Math.max(holePar - playerScore + 2 + CR, 0);
    }
    else {
      return null;
    }

  }

  calculateGrossPoints(holePar: number, playerScore: number) {
    if (playerScore) {
      return Math.max(holePar - playerScore + 2, 0);
    }
    else {
      return null;
    }

  }

  editScore(game: any, hole: Hole, participant: string) {
    let popover = this.popoverCtrl.create(ScoreEditPage, { game: game, hole: hole, participant: participant })
    popover.present();
    popover.onDidDismiss(res => this.calculateTotal());
  }

}
