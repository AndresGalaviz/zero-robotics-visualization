/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

class ProgressBarSubsystem implements Subsystem {
  private gameManager : GameManager;

  private progressBar : JQuery;
  
  private updateProgressBar : (val: number) => {}
  
  private setVal = -1.0;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
  }

  update = (dt:number, time:number, paused:boolean) => {
    if (!paused) {
      // console.log(this.timeToFrac(time));
      this.setVal = this.timeToFrac(time);
      this.updateProgressBar(this.timeToFrac(time));
    } else {
      this.setVal = -1.0;
    }
  }

  onChange = (val: number) => {
    if (!this.gameManager.initialized) return;
    if (Math.abs(val - this.setVal) < 1E-5) return;
    if (Math.abs(this.gameManager.getTime() - this.fracToTime(val)) < 1) return;
    this.gameManager.play(this.fracToTime(val));
    this.gameManager.loop(0, true);
    this.gameManager.pause();
  }
  
  fracToTime = (val: number) => {
    return val * this.gameManager.getEndTime()
  }
  
  timeToFrac = (val: number) => {    
    return val / this.gameManager.getEndTime();
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }
}

export = ProgressBarSubsystem;
