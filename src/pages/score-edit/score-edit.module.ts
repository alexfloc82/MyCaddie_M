import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreEditPage } from './score-edit';

@NgModule({
  declarations: [
    ScoreEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreEditPage),
  ]
})
export class ScoreEditPageModule {}
