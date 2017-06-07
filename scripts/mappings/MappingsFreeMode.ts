import Results = require("../Results");
import ResultObject = Results.ResultObject;
import IExResObject = Results.IExtendedResultObject;
import TextWithTime = Results.TextWithTime;
import GameManager = require("../GameManager");

export class ResultObjectFreeMode extends ResultObject implements IExResObject {
  getFuel = (satNumber: number):number[] => {
    var l = this.simData.satData[satNumber].dF[1].length;
    var res = [];
    for (var i = 0; i < l; i++) {
      res.push(1.0);
    }
    return res;
  }

  getScore = (satNumber: number):number[] => {
    var l = this.simData.satData[satNumber].dF[0].length;
    var res = [];
    for (var i = 0; i < l; i++) {
      res.push(0);
    }
    return res;
  }
    
  setupGameManager = (gameManager: GameManager): void => {
    // No extra susystems
  }
  
  getDebugTextArray = (satNumber: number):
    TextWithTime[] => {
    var times = this.simData.tTxt;
    var data = this.simData.satData[satNumber].txt;

    var result: TextWithTime[] = [];

    for (var i = 0; i < times.length; i++) {
      var text = data[i];
      if (text == "") continue;

      result.push({time: times[i], text: text, index: i, type: "DBG"});
    }

    return result;
  }
}