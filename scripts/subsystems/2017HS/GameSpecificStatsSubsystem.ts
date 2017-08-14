/// <reference path="../../CommonImports.ts"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import StatsSubsystemMod = require("../template/StatsSubsystem");
import StatsSubsystem = StatsSubsystemMod.StatsSubsystem;
import Results2017HS = require("../../mappings/Mappings2017HS");
import ResultObject2017HS = Results2017HS.ResultObject2017HS;

class GameSpecificStatsSubsystem extends StatsSubsystem implements Subsystem {
  constructor(gameManager: GameManager) {
    super(gameManager);
  }

  init = () => {
    var sphereZeroStats = this.getSatStatsSet(0);
    var sphereOneStats = this.getSatStatsSet(1);

    var labels: StatsSubsystemMod.Labels =
    {
      longArrayLabels: [],
      shortArrayLabels: ["Samples Held:", "Has Analyzer:", "Points/Sec:"]
    }

    var sphereZeroStatsObject = $("#statsbox-sphere1 #gamespecificstatsbox");
    var sphereOneStatsObject = $("#statsbox-sphere2 #gamespecificstatsbox");

    this.initData(sphereZeroStats, sphereOneStats, labels,sphereZeroStatsObject, sphereOneStatsObject);

    this.getClasses = (label: string, value: number): [string[], string[], string[]] => {
      var containerClasses = []
      var labelClasses = []
      var valueClasses = []

      containerClasses.push("wide");

      if (label == "Has Analyzer:") {
        if (value > 0) valueClasses.push("green");
        else valueClasses.push("red");
      }

      return [containerClasses, labelClasses, valueClasses];
    }

    this.mapValue = (label: string, val: number): string => {
  	  if(label == "Samples Held:") 
        return Math.floor(val).toString();
       else if (label == "Has Adapter:") {
        if (val > 0) 
          return "yes";
        else 
          return "no";
      }
      return val.toString();
    }
  }

  private getSatStatsSet = (satNumber: number): StatsSubsystemMod.Stats => {
    var state = this.gameManager.resObject.getDataStateArray(satNumber);

    return {
      longArrays: [],
      shortArrays: [
        (<ResultObject2017HS> this.gameManager.resObject).getZoneError(satNumber),
        (<ResultObject2017HS> this.gameManager.resObject).getReceiver(satNumber),
        (<ResultObject2017HS> this.gameManager.resObject).getPointsPerSecond(satNumber)
      ]
    };
  }
}

export = GameSpecificStatsSubsystem;
