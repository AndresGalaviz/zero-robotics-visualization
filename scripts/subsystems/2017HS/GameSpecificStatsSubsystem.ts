/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import StatsSubsystemMod = require("../template/StatsSubsystem");
import StatsSubsystem = StatsSubsystemMod.StatsSubsystem;
import Results2017HS = require("../../mappings/Mappings2017HS");
import ResultObject2016HS = Results2017HS.ResultObject2017HS;

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
      shortArrayLabels: ["SPS Held:", "SPS Error:", "Has Adapter:", "Points/Sec:"]
    }

    var sphereZeroStatsObject = $("#statsbox-sphere1 #gamespecificstatsbox");
    var sphereOneStatsObject = $("#statsbox-sphere2 #gamespecificstatsbox");

    this.initData(sphereZeroStats, sphereOneStats, labels,sphereZeroStatsObject, sphereOneStatsObject);

    this.getClasses = (label: string, value: number): [string[], string[], string[]] => {
      var containerClasses = []
      var labelClasses = []
      var valueClasses = []

      containerClasses.push("wide");

      if (label == "Has Adapter:") {
        if (value > 0) valueClasses.push("green");
        else valueClasses.push("red");
      }

      return [containerClasses, labelClasses, valueClasses];
    }

    this.mapValue = (label: string, val: number): string => {
  	  if(label == "SPS Held:") {
  	  	return Math.floor(val).toString();
  	  } else if(label == "SPS Error:") {
  	  	if (val > 5) {
  			 return "N/A";
        } 
  		} else if (label == "Has Adapter:") {
        if (val > 0) {
          return "yes";
        } else {
          return "no";
        }
      }
      return val.toString();
    }
  }

  private getSatStatsSet = (satNumber: number): StatsSubsystemMod.Stats => {
    var state = this.gameManager.resObject.getDataStateArray(satNumber);

    return {
      longArrays: [],
      shortArrays: [
        (<ResultObject2016HS> this.gameManager.resObject).getZoneError(satNumber),
        (<ResultObject2016HS> this.gameManager.resObject).getReceiver(satNumber),
        (<ResultObject2016HS> this.gameManager.resObject).getPointsPerSecond(satNumber)
      ]
    };
  }
}

export = GameSpecificStatsSubsystem;
