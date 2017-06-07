import ZoneSubsystem = require("../subsystems/2016HS/ZoneSubsystem");
import SpsSubsystem = require("../subsystems/2016HS/SpsSubsystem");
import GameSpecificStatsSubsystem = require("../subsystems/2016HS/GameSpecificStatsSubsystem");
import ItemSubsystem = require("../subsystems/2016HS/ItemSubsystem");
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

export class ResultObject2016HS extends ResultObject implements IExResObject {
  public setupGameManager(gameManager: GameManager) : void {
    gameManager.subsystems["ItemSubsystem"] = new ItemSubsystem(gameManager);
    
    gameManager.subsystems["gameSpecificStats"] = new GameSpecificStatsSubsystem(gameManager);
    gameManager.subsystems["ZoneSubsystem"] = new ZoneSubsystem(gameManager);
  gameManager.subsystems["SpsSubsystem"] = new SpsSubsystem(gameManager);
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

  getZone = (satNumber: number):number[] => {
    var zone = [];

    if (satNumber == 0){
      zone[0] = 22.16;
      zone[1] = 33.18;
      zone[2] = 27.70;
    } else {
      zone[0] = -22.16;
      zone[1] = -33.18;
      zone[2] = -27.70;
    }

  
    return zone;
  }

  getZoneError = (satNumber: number):number[] => {
  return this.simData.satData[satNumber].dU[3].map(x => x / 10000);
  }

  getEstimatedZone = (satNumber: number):number[][] => {
    for(var i = 0; i < this.simData.satData[satNumber].dU[3].length; i++) {
    if(this.simData.satData[satNumber].dU[3][i] != -1) {

    }
  }
  return null;
  }

  getSpsHeld = (satNumber: number):number[] => {
    for (var i = 0; i < this.simData.satData[satNumber].dU[7].length; i++) {
      if (this.simData.satData[satNumber].dU[7][i] == null) {
        this.simData.satData[satNumber].dU[7][i] = this.simData.satData[satNumber].dU[7][i-1];
      }
    }
    return this.simData.satData[satNumber].dU[7];
  }

  getPointsPerSecond = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dU[8].map(x => x / 100);
  }

  getReceiver = (satNumber: number):number[] => {
    return this.simData.satData[satNumber].dU[10];
  }

  getFace = (itemID : number):number => {
    // var item = Math.floor(itemID / 2);
    // var face = this.simData.satData[0].dU[12+item][0];
    // if (itemID % 2 == 1) {
    //   if (face == 0) {
    //     return 1;
    //   } else if (face == 1) {
    //     return 5;
    //   } else {
    //     return 5 - face;
    //   }
    // }

    // if (face == 1) {
    //   return 4;
    // }
    // return this.simData.satData[0].dU[12+item][0];
    return 0;
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

  getSpsDrops = ():{time: number, pos: number[]}[][] => {
    console.log("0 dU:",this.simData.satData[0].dU);
  console.log("1 dU:",this.simData.satData[1].dU);
    var result = [];
  for(var i = 0; i < 2; i++) {
    result[i] = [];
      for(var j = 0; j < this.simData.satData[i].dU[2].length; j++) {
      if(this.simData.satData[i].dU[2][j] == 1) {
        console.log("sps dropped at ",j);
        var pos = [];
        var timeIndex = this.getLongIndexByTime(j);
        for(var k = 0; k < 3; k++) {
          pos[k] = this.simData.satData[i].st[k][timeIndex];
        }
        result[i].push({time: j, pos: pos});
      }
    }
  }
  console.log(result);
  return result;
  }

  getItemData = ():{pos: number[], att: number[], type: ItemType2016HS}[][] => {
    console.log("0 dS:",this.simData.satData[0].dS);
    console.log("1 dS:",this.simData.satData[1].dS);
    var scaling = 1.0/10000.0;
    var master = this.getMasterSphere();
    var itemData = new Array(9);
    for (var i = 0; i < 9; i++) {
      itemData[i] = new Array(188);
      for (var j = 0; j < 188; j++) {
        itemData[i][j] = {pos: [0,0,0], att: [-5,-5,-5], type: ItemType2016HS.Large};
      }
    }

    for(var i = 0; i < 4; i++) {
      var pos, att, type;
      for(var j = 0; j < 3; j++) {
        switch(i) {
          case 0: 
            pos = [0.2810, 0.3853, 0.1277];
            att = [0.1283, 0.6639, -0.7368];
            break;

          case 1:
            pos = [0.1389, 0.1210, 0.1995];
            att = [0.5272, 0.2020, -0.8254];
            break;

          case 2:
            pos = [0.1791, 0.0735, 0.3972];
            att = [-0.2188, 0.8523, -0.4750];
            break; 

          case 3:
            pos = [-0.0671, -0.0186, -0.2864];
            att = [1, 0, 0];
            break;
        }

        if (i == 3) {
          type = ItemType2016HS.Receiver;
        } else {
         type = itemOrder[i];
        }
      }

      var neg = function(x) {return -x};

      var temp = att[2];
      //flip z
      att[2] = att[1];
      att[1] = -temp;

      if (i != 3) {
        itemData[i*2][0] = {pos: pos, att: att, type: type};
        itemData[i*2+1][0] = {pos: pos.map(neg), att: att.map(neg), type: type};
      } else {
        itemData[7][0] = {pos: pos, att: att, type: type};
        itemData[8][0] = {pos: pos.map(neg), att: att.map(neg), type: type};
      }

      if (i == 2) {
        itemData[6][0] = {pos: [0,0,0], att: [1,0,0], type: ItemType2016HS.Special};
      }
    }
  
    //replaces itemdata with the correct information for special events
    for (var sph = 0; sph < 2; sph++) {
      for (var t = 188; t < this.simData.satData[sph].dS[0].length; t++) {
        var item = this.simData.satData[sph].dS[0][t];
        var realTime = this.simData.satData[sph].dS[12][t] / 10;
        console.log("real time = " + realTime);
        var inst = this.simData.satData[sph].dS[1][t];
        var newAtt = [];

        if ((inst == 0) || (inst == 1) || (inst == 3)) {
          for (var offset = 0; offset < 3; offset++) {
            newAtt[offset] = this.simData.satData[sph].dS[2+offset][t] / 10000;
          }
          var temporary = newAtt[2];
          //flip z
          newAtt[2] = newAtt[1];
          newAtt[1] = -temporary;
          itemData[item][realTime].att = newAtt;
          //console.log("special type [" + inst + "] -> item " + item + " at " + realTime + ": " + newAtt);
        }
      }
    }

    for(var i = 0; i < 7; i++) {
      var sat = Math.floor(i/4);
      var start = (i%4)*3;
      var itemHeld = false;
      for(var j = 1; j < 188; j++) {
        var nextPos = [], nextAtt = [];
        if (j == 187) {
          nextPos = itemData[i][j-1].pos;
        } else {
          for(var k = 0; k < 3; k++) {
            nextPos[k] = this.simData.satData[sat].dS[start+k][j-1] * scaling;
          }
        }
        var satHold = -1;
        var time, itemPickup;
        for (var satNum = 0; satNum < 2; satNum++) {
          itemPickup = this.convertToSigned(this.simData.satData[satNum].dU[1][j]);
          if(itemPickup == i) {
            time = this.getDataTimesArray()[j];
            time = this.getLongIndexByTime(time);
            satHold = satNum;
            break;
          }
        }
        
        //if (j == 187 || satHold == -1) {
          if (itemData[i][j].att[0] == -5 && itemData[i][j].att[1] == -5 && itemData[i][j].att[2] == -5) {
          nextAtt = itemData[i][j-1].att;
          itemData[i][j].att = nextAtt;
        }
        itemData[i][j].type = itemData[i][0].type;
        itemData[i][j].pos = nextPos;
      }
    }




    for(var i = 7; i < 9; i++) {
      for(var j = 1; j < this.simData.satData[sat].dS[0].length; j++) {
        var tpos = itemData[i][j-1].pos;
        if(this.simData.satData[0].dU[10][j] == i || this.simData.satData[0].dU[10][j] == 15 || this.simData.satData[1].dU[10][j] == i || this.simData.satData[1].dU[10][j] == 15) {
          tpos = [0,0,0];
        }
        itemData[i][j] = {pos: tpos, att: [0,0,0], type: ItemType2016HS.Receiver};
      }
    }

    return itemData;
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

    return mapping[type];
  }

}

export enum ItemType2016HS {
  Large, Medium, Small, Special, Receiver, SPS
}

var itemOrder = [ItemType2016HS.Large, ItemType2016HS.Medium, ItemType2016HS.Small, ItemType2016HS.Special, ItemType2016HS.Receiver];
