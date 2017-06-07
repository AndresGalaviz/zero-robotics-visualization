/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

class ProgressBarSubsystem implements Subsystem {
  private gameManager : GameManager;

  private timeBox : JQuery;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
    this.timeBox = $("#time-container");
    if (this.timeBox.length == 0) {
      console.log("The DOM element of the time container was not found.");
    }
  }

  update = (dt:number, time:number, paused:boolean) => {
    if (paused || this.timeBox.length == 0) return;
    this.timeBox.text(time.toFixed(0)+" s");
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }
}

export = ProgressBarSubsystem;
