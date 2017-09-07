import GameManager = require("./GameManager");
import Results2017HS = require("./mappings/Mappings2017HS");
import ResultObject2016HS = Results2017HS.ResultObject2017HS;

import Constants = require("./Constants");

export interface SatSimData {
  dF: number[][];
  dS: number[][];
  dU: number[][];
  dUser: number[][];
  st: number[][];
  txt: string[];
}

export interface SimData {
  baseSeeds: number[];
  codgen_ver: string;
  satData : SatSimData[];
  results: number[];
  simulationId: string;
  standalone_ver: string;
  tDbg : number[];
  tSt: number[];
  tTxt: number[];
};

export interface IExtendedResultObject extends ResultObject {
  getFuel: (number) => number[];
  getScore: (number) => number[];
  setupGameManager: (gameManager: GameManager) => void;
  getDebugTextArray: (number) => TextWithTime[];
}

export interface TextWithTime {
  type: string;
  index: number;
  time: number;
  text: string;
}

export class ResultObject {

  simData: SimData;

  constructor(data: SimData) {
    this.simData = data;
  }

  getDataFloatArray = (satNumber: number):number[][] => {
    return this.simData.satData[satNumber].dF;
  }

  getDataShortArray = (satNumber: number):number[][] => {
    return this.simData.satData[satNumber].dS;
  }

  getDataUShortArray = (satNumber: number):number[][] => {
    return this.simData.satData[satNumber].dU;
  }

  getDataTimesArray = ():number[] => {
    return this.simData.tSt;
  }

  getDataStateArray = (satNumber: number):number[][] => {
  	return this.simData.satData[satNumber].st;
  }

  getMasterSphere = ():number => {
    if (this.simData.satData[0].dF !== null) {
      return 0;
    }

    return 1;
  }

  getLongIndexByTime = (time: number):number => {
    // TODO binary search

    var times = this.getDataTimesArray();

    for(var i = 0; i < times.length; i++) {
      if (time < times[i]) {
        return i-1;
      }
    }

    return times.length-1;
  }

  getShortIndexByTime = (time: number): number => {
    // this assumes that index 0 is not valid because in the current
    // game implementation packets at index 0 are meant for initialization
    return Math.max(1, Math.min(this.simData.tDbg.length-2, Math.floor(time)));
  }

  interpShortValueByTime = (arr: number[], time: number,
    interpLoopAround: boolean = false, interpLoopAxis = 1): number => {
    var index = this.getShortIndexByTime(time);

    if (time <= index) return arr[index];

    var index2 = Math.min(this.simData.tDbg.length-1, index+1);

    var prop = time - Math.floor(time);

    var val1 = arr[index];
    var val2 = arr[index2];

    var loopAroundLength = Constants.gameSpaceDims[interpLoopAxis];

    // if the loop flag is set and the values are in different ends of the field
    if (interpLoopAround &&
        val1 * val2 < 0 &&
        Math.abs(val1) + Math.abs(val2) > 0.9 * loopAroundLength) {
          var diff = (val2 - val1 + loopAroundLength) % (loopAroundLength);
          return (val1 + diff * prop + loopAroundLength/2) % loopAroundLength - loopAroundLength/2;
    }

    return arr[index2] * prop + arr[index] * (1 - prop);
  }
}
