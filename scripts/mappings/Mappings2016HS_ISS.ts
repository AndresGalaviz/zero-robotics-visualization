import Mappings2016HS = require("./Mappings2016HS");
import ResultObject2016HS = Mappings2016HS.ResultObject2016HS;
import ItemType2016HS = Mappings2016HS.ItemType2016HS;

export class ResultObject2016HS_ISS extends ResultObject2016HS {
  
  getZone = (satNumber: number):number[] => {
    var zone = [];

    if (satNumber == 0){
      zone[0] = 22.16;
      zone[1] = 27.70;
      zone[2] = 33.18;
    } else {
      zone[0] = -22.16;
      zone[1] = -27.70;
      zone[2] = -33.18;
    }

  
    return zone;
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
            pos = [0.281, -0.3853, 0.1277];
            att = [0.1283, 0.6639, -0.7368];
            break;

          case 1:
            pos = [-0.2389, -0.4210, 0.0395];
            att = [0.5272, 0.2020, -0.8254];
            break;

          case 2:
            pos = [0.1791, 0.0735, -0.3972];
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


}

var itemOrder = [ItemType2016HS.Large, ItemType2016HS.Medium, ItemType2016HS.Small, ItemType2016HS.Special, ItemType2016HS.Receiver];
