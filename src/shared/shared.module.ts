import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClubPipe} from './club.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ClubPipe
  ],
  exports:[
    ClubPipe
  ]
})
export class SharedModule { }
