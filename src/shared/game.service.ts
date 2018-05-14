import { Injectable } from '@angular/core';
import { User, Course, Hole, Game } from '../shared/datamodel';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable()
export class GameService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getGame(gameId: string, user?: string) {
    let gameComplete: any;
    return new Promise<Game>((resolve) => {
      this.afs.collection('games').doc<Game>(gameId).valueChanges().subscribe(game => {
        gameComplete = game;
        this.afs.collection('clubs').doc(game.club).valueChanges().subscribe(club => {
          gameComplete['clubComplete'] = club;
          this.afs.collection('clubs').doc(game.club).collection('courses').doc<Course>(game.course).valueChanges().subscribe(course => {
            gameComplete['courseComplete'] = course;
            this.afs.collection('games').doc(gameId).collection('scores').snapshotChanges().subscribe(scores => {
              gameComplete['scores'] = {};
              scores.forEach(score => {
                gameComplete['scores'][score.payload.doc.id] = score.payload.doc.data();
              });
              resolve(gameComplete);
            });
          })
        })
      })
    });
  }

  getCurrentHole(gameId: string) {
    let hole: any;
    let gameComplete: any;
    return new Promise<Hole>((resolve) => {
      this.afs.collection('games').doc<Game>(gameId).valueChanges().subscribe(game => {
        gameComplete = game;
        this.afs.collection('clubs').doc(game.club).collection('holes').doc<Hole>(game.currentHole).valueChanges().subscribe(hole => {
          resolve(hole);
        })
      })
    });
  }

  getHoleDetail(club: string, hole: string) {
    return new Promise<Hole>((resolve) => {
      this.afs.collection('clubs').doc(club).collection('holes').doc<Hole>(hole).valueChanges().subscribe(hole => {
        resolve(hole);
      })
    });
  }

  getHolesDetail(club: string, holes: any[]) {
    let promiseHole = [];
    holes.forEach(hole => {
      promiseHole.push(new Promise<Hole>((resolve, reject) =>
        this.afs.collection('clubs').doc(club).collection('holes').doc<Hole>(hole.holeId).valueChanges().subscribe(holeDetail => {
          hole.detail=holeDetail;
          resolve(hole);
        })
      ))
    })

    return Promise.all(promiseHole)
  }

  getParticipantsDetail(users: string[]) {
    let promiseUser = [];
    users.forEach(user => {
      promiseUser.push(new Promise<User>((resolve, reject) =>
        this.afs.collection('users').doc<User>(user).valueChanges().subscribe(user => resolve(user))
      ))
    })

    return Promise.all(promiseUser)
  }

  getParticipantDetail(user: string){
    return new Promise<User>((resolve) => {
         this.afs.collection('users').doc<User>(user).valueChanges().subscribe(user => {
           resolve(user);
         })
       });
  }

  getScores(game: string, hole: string) {
    return new Promise((resolve) => {
      this.afs.collection('games').doc(game).collection('scores').doc(hole).valueChanges().subscribe(score => {
        resolve(score);
      })
    });
  }

  saveScore(game: string, hole: string, participant:string, score:number, isnew?:boolean){
    let newscore={};
    newscore[participant]=score;
    if(isnew){
      return new Promise((resolve) => {this.afs.collection('games').doc(game).collection('scores').doc(hole).set(newscore)});
    }else{
      return new Promise((resolve) => {this.afs.collection('games').doc(game).collection('scores').doc(hole).update(newscore)});
    }
    
  }

  setStatus(game:string, isOpen:boolean){
    let obj = {};
    obj['isOpen'] = isOpen;
    return this.afs.collection('games').doc(game).update(obj)
  }

}
