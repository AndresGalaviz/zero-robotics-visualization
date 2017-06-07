/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

import ResultsModule = require("../../Results");
import IExGameManager = ResultsModule.IExtendedResultObject;
import TextWithTime = ResultsModule.TextWithTime;

class DebugTextSubsystem implements Subsystem {
  private gameManager : GameManager;
  private textBox : JQuery;
  private currTime = -1;
  private currLines = -1;
  private currHTML = "";
  private satDebugTexts: TextWithTime[][];


  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
    this.textBox = $("#debug-box");
    this.satDebugTexts = [
      this.gameManager.resObject.getDebugTextArray(0),
      this.gameManager.resObject.getDebugTextArray(1),
    ];
  }

  update = (dt:number, time:number, paused:boolean) => {
    var newTime = this.gameManager.resObject.getShortIndexByTime(time);
    if (newTime == this.currTime) return;
    
    this.currTime = newTime;
    var [newLines, newHtml] = this.getDebugText();
    if (newLines == this.currLines) return;
    
    this.currLines = newLines;
    
    // only auto scroll to the bottom if the user hasn't scrolled up
    var shouldScrollDown = Math.abs(this.textBox[0].scrollHeight - this.textBox.scrollTop() -
      this.textBox.outerHeight()) < 10;
      
    if (newHtml.length > this.currHTML.length) {      
      var htmlDiff = newHtml.substring(this.currHTML.length);
      this.textBox.append(htmlDiff);
    } else {
      this.textBox.html(newHtml);
    }
    
    this.currHTML = newHtml;
    
    if (shouldScrollDown) {
      this.textBox.scrollTop(this.textBox[0].scrollHeight);
    }
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }

  private getDebugText(): [number, string] {
    var text = "";

    var messages = [];


    var filterTime = elem => elem.time <= this.currTime;
    var addMessages = (sphereNum, elem) => {
        var text = "<span class='debug-tag'><span class='debug-sphere debug-sphere"+sphereNum+
        "'>Sphere "+sphereNum+"</span>, <span class='debug-time'>"+elem.time+".0s, </span><span class='debug-type'>"+
        elem.type+"</span></span>: "+
        Helpers.escapeHTML(elem.text) + "<br/>";

        messages.push({time: elem.time, text: text, offset: elem.index});
    }

    [0,1].forEach((sphere) => {      
      this.satDebugTexts[sphere].filter(filterTime).forEach(addMessages.bind(this, (sphere+1).toString()));
    });

    messages.sort((a, b) => {
      if (a.time != b.time) return a.time - b.time;
      return a.offset - b.offset;
    });
    return [messages.length, messages.map(e => e.text).join("")];
  }
}

export = DebugTextSubsystem;
