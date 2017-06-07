import SwitchingLightSubsystem = require("../subsystems/2016MS/SwitchingLightSubsystem");

import GameSpecificStatsSubsystem = require("../subsystems/2016MS/GameSpecificStatsSubsystem");

import UploadSubsystem = require("../subsystems/2015/UploadSubsystem");
import MirrorSubsystem = require("../subsystems/2015/MirrorSubsystem");
import PhotoSubsystem = require("../subsystems/2015/PhotoSubsystem");
import ItemSubsystem = require("../subsystems/2015/ItemSubsystem");
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

export class ResultObject2016MS extends ResultObject implements IExResObject {
  public setupGameManager(gameManager: GameManager) : void {
    gameManager.subsystems["itemSubsystem"] = new ItemSubsystem(gameManager);
    gameManager.subsystems["photoSubsystem"] = new PhotoSubsystem(gameManager);
    gameManager.subsystems["mirrorSubsystem"] = new MirrorSubsystem(gameManager);
    gameManager.subsystems["uploadSubsystem"] = new UploadSubsystem(gameManager);
    gameManager.subsystems["gameSpecificStats"] = new GameSpecificStatsSubsystem(gameManager);
    gameManager.subsystems["SwitchingLightSubsystem"] = new SwitchingLightSubsystem(gameManager);
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

  getEnergy = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dF[2];
  }

  getMirrorUsedData = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dS[12];
  }

  getItemPickupTimes = (satNumber: number):number[][] => {
    var numItems = this.getItemData().length;
    var result = [];

    var shorts = this.getDataShortArray(satNumber);

    for (var i = 0; i < numItems; i++) {
      result.push(shorts[i]);
    }
    return result;
  }

  getItemData = ():{pos: number[], type: ItemType2015}[] => {
    var scaling = 1.0/10000.0;
    var res = [];
    var master = this.getMasterSphere();
    var itemNum = this.simData.satData[master].dU[2][0]; //figure this out
    /*var itemNum = 10;*/

    var upTo = 5;
    var onlyOne = false;
    if (itemNum < upTo) {
      upTo = itemNum;
      onlyOne = true; // data in only one satellite
    }

    for (var i = 0; i < upTo; i++) {
      var x = this.simData.satData[0].dS[3*i][0] * scaling;
      var y = this.simData.satData[0].dS[3*i+1][0] * scaling;
      var z = this.simData.satData[0].dS[3*i+2][0] * scaling;

      var type = this.simData.satData[0].dU[3+i][0];
      /*console.log(type);*/
      var typeEnum = itemOrder[type];
      res.push({pos: [x, y, z], type: typeEnum});
    }

    if (onlyOne) return res;

    for (var i = 0; i < itemNum - 5; i++) {
      var x = this.simData.satData[1].dS[3*i][0] * scaling;
      var y = this.simData.satData[1].dS[3*i+1][0] * scaling;
      var z = this.simData.satData[1].dS[3*i+2][0] * scaling;

      var type = this.simData.satData[0].dU[8+i][0];
      var typeEnum = itemOrder[type];
      res.push({pos: [x, y, z], type: typeEnum});
    }

    return res;

  }

  getLightCenterArray = (satNumber: number): number[] => {
    return this.simData.satData[satNumber].dF[3];
  }

  getLightDirectionArray = (satNumber: number): number[] => {
    var data =  this.simData.satData[satNumber].dU[7];
    return data.map((n: number) => 2*n - 1); // map from (0, 1) to (-1, 1)
  }

  getPictureTakenData = (satNumber: number): number[] => {
    return this.simData.satData[satNumber].dU[8];
  }

  getPictureUploadedData = (satNumber: number): number[] => {
    return this.simData.satData[satNumber].dU[9];
  }

  getLightStatusData = (satNumber: number): number[] => {
    var data = this.simData.satData[satNumber].dU[6];
    for (var i = 0; i < data.length; i++) {
      var val = data[i];
      var newval;
      if (val == 2) newval = 1;
      else if (val == 1) newval = -1;
      else newval = 0;
      data[i] = newval;
    }
    return data
  }
  getMemoryFilled = (satNumber: number): number[] => {
    return this.simData.satData[satNumber].dU[13];
  }

  getCameraOn = (satNumber: number): number[] => {
    return this.simData.satData[satNumber].dU[10];
  }


  getLightConfig = () => {
    var sphereNum = this.getMasterSphere();
    var data = this.simData.satData[sphereNum];

    return {
      center: data.dF[0][0], // plus or minus one
      direction: data.dF[1][0], // plus or minus one
    }
  }


  getGameType = (): GameType => {
    var type = this.simData.satData[this.getMasterSphere()].dU[1][0];
    var mapping = {
      3: GameType.Alliance,
      2: GameType.ZR3D,
      1: GameType.ZR2D
    }

    return mapping[type];
  }

}

export enum ItemType2015 {
  Score, Mirror, Energy
}

var itemOrder = [ItemType2015.Score, ItemType2015.Energy, ItemType2015.Mirror];
