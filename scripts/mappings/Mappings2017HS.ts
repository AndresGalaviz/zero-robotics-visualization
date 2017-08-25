
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
    if(this.getGameType()==GameType.ZR2D)
      var pos = [30,0,-48]; //returns the position of the first analyzer object
    else
      var pos = [30,36,-48];
    return pos 
  }
getAnalyzer2 = ():number[] =>{
  if(this.getGameType()==GameType.ZR2D)
    var pos = [-30,0,48];
  else
    var pos = [-30,36,48];
  return pos;
  }

  getSamplesHeld = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dU[5]; //takes in an array and returns a new array where each element is divided by 10000
  }

  getAnalyzer = (satNumber: number):number[] => {
    var result = new Array(this.simData.satData[satNumber].dU[8].length);
    for(var i = 0;i<this.simData.satData[satNumber].dU[8].length;i++){
      result[i] = this.simData.satData[satNumber].dU[8][i]*2+this.simData.satData[satNumber].dU[7][i];
    }
    return result; 
  }

  getTotalSamples = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dU[6];
  }



  getTerrainArray = (satNumber: number):number[][]=>{
    var dS = this.simData.satData[0].dS;
    var grid = new Array();
    var counter = 0;
    for(var i = 1;i<11;i++){ //iterate through arrays 1 to 14 where our grid heights are stored 
        grid.push([]);
        grid.push([]);
      for (var t = 188; t < dS[i].length; t++) {
        grid[counter].push((dS[i][t]>>8) & 0xFF);
        grid[counter+1].push(dS[i][t] & 0xFF);
      }
      counter+=2;
    }
    return grid;
  }

  convertToSigned = (unsignedNum : number): number => {
    if(unsignedNum & 0x8000)
    return unsignedNum - 0x10000; 
  return unsignedNum;
  }

  getGameType = (): GameType => {
    var type = this.simData.satData[this.getMasterSphere()].dS[0][4];
    var mapping = {
      3: GameType.Alliance,
      2: GameType.ZR3D,
      1: GameType.ZR2D
    }

    return mapping[type];
    // return GameType.ZR3D;
  }

}




