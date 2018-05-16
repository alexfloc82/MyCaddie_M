import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SharedModule } from '../shared/shared.module';
import { ScorecardPageModule } from '../pages/scorecard/scorecard.module';
import { NewGamePageModule } from '../pages/new-game/new-game.module';
import { ScoreEditPageModule } from '../pages/score-edit/score-edit.module';

import { environment } from '../../environments/environment';

import { UserPage } from '../pages/user/user';
import { ContactPage } from '../pages/contact/contact';
import { GamePage } from '../pages/game/game';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {GameService} from '../shared/game.service';

@NgModule({
  declarations: [
    MyApp,
    UserPage,
    ContactPage,
    GamePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp), SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, AngularFireAuthModule, 
    ScorecardPageModule,
    NewGamePageModule, 
    ScoreEditPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UserPage,
    ContactPage,
    GamePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GameService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  exports:[]
})
export class AppModule {}
