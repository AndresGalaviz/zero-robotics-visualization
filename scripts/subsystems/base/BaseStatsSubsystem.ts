 /// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import StatsSubsystemMod = require("../template/StatsSubsystem");
import StatsSubsystem = StatsSubsystemMod.StatsSubsystem;
import Results = require("../../Results");
import IExtendedResultObject = Results.IExtendedResultObject;

class BaseStatsSubsystem extends StatsSubsystem implements Subsystem {
  constructor(gameManager: GameManager) {
    super(gameManager);
  }


  init = () => {
    var sphereZeroStats = this.getSatStatsSet(0);
    var sphereOneStats = this.getSatStatsSet(1);
    var tempScore;

    var labels: StatsSubsystemMod.Labels =
    {
      longArrayLabels: ["pX:", "pY:", "pZ:", "vX:", "vY:", "vZ:", "nX:", "nY:",
        "nZ:", "ωX:", "ωY:", "ωZ:"],
      shortArrayLabels: ["Fuel:", "Score:"]
    }

    var sphereZeroStatsObject = $("#statsbox-sphere1 #commonstatsbox");
    var sphereOneStatsObject = $("#statsbox-sphere2 #commonstatsbox");

    this.initData(sphereZeroStats, sphereOneStats, labels,sphereZeroStatsObject, sphereOneStatsObject);

    this.getClasses = (label: string, value: number): [string[], string[], string[]] => {
      /*console.log(label)*/
      var containerClasses = []
      var labelClasses = []
      var valueClasses = []

      
      var counter = 0;

      if (["Fuel:", "Score:"].indexOf(label) > -1) containerClasses.push("wide");

      if (label == "Fuel:") {
        if (value > 0.7) valueClasses.push("green")
        else if (value > 0.3) valueClasses.push("orange")
        else valueClasses.push("red")
      }

      return [containerClasses, labelClasses, valueClasses]
    }
    
    this.mapValue = (label: string, val: number): string => {
      if (label == "Fuel:") {
          return Math.round(val * 100) + "%";
      }
      return val.toString();
    }
  }

  private transformQuaternionToNormal = (i:number[], j:number[], k:number[], q: number[])
  :[number[], number[], number[]] => {
    var x = []
    var y = []
    var z = []

    for (var ind = 0; ind < q.length; ind++) {
      var quat = new THREE.Quaternion(i[ind], j[ind], k[ind], q[ind]).normalize()
      var normal = new THREE.Vector3( -1, 0, 0 ).applyQuaternion(quat)
      x.push(normal.x)
      y.push(normal.y)
      z.push(normal.z)
    }

    return [x, y, z]
  }

  getSatStatsSet = (satNumber: number): StatsSubsystemMod.Stats => {
      var state = this.gameManager.resObject.getDataStateArray(satNumber);

      var [normalx, normaly, normalz] = this.transformQuaternionToNormal(state[6], state[7], state[8], state[9])

      //removes all null values
      for (var i = 0; i < (<IExtendedResultObject> this.gameManager.resObject).getScore(satNumber).length; i++) {
        if ((<IExtendedResultObject> this.gameManager.resObject).getScore(satNumber)[i] == null) {
          (<IExtendedResultObject> this.gameManager.resObject).getScore(satNumber)[i] = (<IExtendedResultObject> this.gameManager.resObject).getScore(satNumber)[i-1];
        }
      }

      for (var i = 0; i < (<IExtendedResultObject> this.gameManager.resObject).getFuel(satNumber).length; i++) {
        if ((<IExtendedResultObject> this.gameManager.resObject).getFuel(satNumber)[i] == null) {
          (<IExtendedResultObject> this.gameManager.resObject).getFuel(satNumber)[i] = (<IExtendedResultObject> this.gameManager.resObject).getFuel(satNumber)[i-1];
        }
      }
      
      return {
        longArrays: [state[0], state[1], state[2], state[3], state[4], state[5],
          normalx, normaly, normalz, state[10], state[11], state[12]],
        shortArrays: [
          (<IExtendedResultObject> this.gameManager.resObject).getFuel(satNumber),
          (<IExtendedResultObject> this.gameManager.resObject).getScore(satNumber),
        ]
      }
  }
}

interface SatStatsSet {
  longArrays: {
    posX: number[];
    posY: number[];
    posZ: number[];
    velX: number[];
    velY: number[];
    velZ: number[];

    normalX: number[];
    normalY: number[];
    normalZ: number[];

    angvelX: number[];
    angvelY: number[];
    angvelZ: number[];
  };
  shortArrays: {
    fuel: number[];
    score: number[];
  }
}

export = BaseStatsSubsystem;
