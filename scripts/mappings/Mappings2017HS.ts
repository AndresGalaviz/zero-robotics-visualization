
import BaseSubsystem = require("../subsystems/2017HS/BaseSubsystem");
import AnalyzerSubsystem = require("../subsystems/2017HS/AnalyzerSubsystem");
import TerrainSubsystem = require("../subsystems/2017HS/TerrainSubsystem");
import GameSpecificStatsSubsystem = require("../subsystems/2017HS/GameSpecificStatsSubsystem");

import GameManager = require("../GameManager");
import Results = require("../Results");
import TextWithTime = Results.TextWithTime;
import ResultObject = Results.ResultObject;
import IExResObject = Results.IExtendedResultObject;

export enum GameType {
  Alliance,
  ZR3D,
  ZR2D
};


export class ResultObject2017HS extends ResultObject implements IExResObject {
  public setupGameManager(gameManager: GameManager) : void {
    gameManager.subsystems["BaseSubsystem"] = new BaseSubsystem(gameManager);  
    gameManager.subsystems["gameSpecificStats"] = new GameSpecificStatsSubsystem(gameManager);
    gameManager.subsystems["AnalyzerSubsystem"] = new AnalyzerSubsystem(gameManager);
    gameManager.subsystems["TerrainSubsystem"] = new TerrainSubsystem(gameManager);
  }
  
  
  getDebugTextArray = (satNumber: number):
    TextWithTime[] => {
    var times = this.simData.tTxt;
    var data = this.simData.satData[satNumber].txt;

    var result: TextWithTime[] = [];

    for (var i = 0; i < times.length; i++) {
      var text = data[i];

      // Find the separators
      var regex = /<!(DBG|GT)\s([0-9]+)>:\s/g;
      var dbgMatches = [];
      var matches;
      while (matches = regex.exec(text)) {
        dbgMatches.push(matches);
      }

      if (dbgMatches.length == 0) continue;
      var messages = text.split(/<!(?:DBG|GT)\s[0-9]+>:\s/);
      messages.shift(); // remove the empty string
      /*console.log(messages);*/
      var messagesWithAttributes = [];
      for (var j = 0; j < dbgMatches.length; j++) {
        var match = dbgMatches[j];
        messagesWithAttributes.push({attr: {type: match[1], number: match[2]}, message: messages[j]});
      }

      messagesWithAttributes.sort((a, b) => {
          if (a.attr.type != b.attr.type) return a.attr.type.localeCompare(b.attr.type);
          return b.attr.number - a.attr.number;
        })


      var finalMessages = messagesWithAttributes.map(e => [e.attr.type, e.message, e.attr.number]);

      finalMessages.forEach(msg => {
        result.push({time: times[i], text: msg[1], index: msg[2], type: msg[0]});
      })
    }

    return result;
  }
  
  getFuel = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dF[1];
  }

  getScore = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dF[0];
  }

//base is at center of the map
  getBase = ():number[] => {
    var zone = [0,0,0]; 
    return zone;
  }
  getAnalyzer1 = ():number[] =>{
      var pos = [22.16,36,27.70]; //returns the position of the first analyzer object
      return pos 
  }
getAnalyzer2 = ():number[] =>{
    var pos = [-22.16,36,-27.70];
    return pos;
  }
  getZoneError = (satNumber: number):number[] => {
  return this.simData.satData[satNumber].dU[3].map(x => x / 10000); //takes in an array and returns a new array where each element is divided by 10000
  }



  getPointsPerSecond = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dU[8].map(x => x / 100); //same as getZoneError()
  }

  getReceiver = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dU[10];
  }

  getFace = (itemID : number):number => {
    return 0;
  }

  getTerrainArray = (satNumber: number):number[][]=>{
  //Right now unable to transmit data correctly so temporarily will hardcode terrain values
  //(init[2]>>8)& 0xff
  // (init[2])& 0Xff //<--- bit math to extract two numbers from one short use on each

    for (var t = 188; t < this.simData.satData[0].dS[0].length; t++) {
      var grid = [];
      for(var i = 0;i<136;i+=8.5){
        grid[i]= [];
        for(var j = 0;j<170;j+=8.5)
          grid[i][j]= Math.ceil(Math.random()*4);
      }
      return grid;
    }
  }

  getAnalyzerStatus = (satNumber: number):number[]=>{
    return this.simData.satData[satNumber].dU[8]; //Sum of me and other's analyzer status 0 if none are taken, 1 if the first one, 2 if the second, 3 if both
  }


  convertToSigned = (unsignedNum : number): number => {
    if(unsignedNum & 0x8000)
    return unsignedNum - 0x10000; 
  return unsignedNum;
  }

  getGameType = (): GameType => {
    var type = this.simData.satData[this.getMasterSphere()].dU[1][0];
    var mapping = {
      3: GameType.Alliance,
      2: GameType.ZR3D,
      1: GameType.ZR2D
    }

    // return mapping[type];
    return GameType.ZR3D;
  }

}




