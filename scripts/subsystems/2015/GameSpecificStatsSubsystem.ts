/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import StatsSubsystemMod = require("../template/StatsSubsystem");
import StatsSubsystem = StatsSubsystemMod.StatsSubsystem;
import Results2015 = require("../../mappings/Mappings2015");
import ResultObject2015 = Results2015.ResultObject2015;

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
      shortArrayLabels: ["Energy:", "Camera:", "Mem filled:", "In zone:"]
    }

    var sphereZeroStatsObject = $("#statsbox-sphere1 #gamespecificstatsbox");
    var sphereOneStatsObject = $("#statsbox-sphere2 #gamespecificstatsbox");

    this.initData(sphereZeroStats, sphereOneStats, labels,sphereZeroStatsObject, sphereOneStatsObject);

    this.getClasses = (label: string, value: number): [string[], string[], string[]] => {
      /*console.log(label)*/
      var containerClasses = []
      var labelClasses = []
      var valueClasses = []

      containerClasses.push("wide");

      if (label == "Energy:") {
        if (value > 4) valueClasses.push("green")
        else if (value > 0.5) valueClasses.push("orange")
        else valueClasses.push("red")
      }

      if (label == "Camera:") {
        if (value >= 1) valueClasses.push("green")
        else valueClasses.push("red")
      }

      if (label == "In zone:") {
        if (value == 1) valueClasses.push("white")
        else if (value == 0) valueClasses.push("grey")
        else valueClasses.push("black")
      }

      return [containerClasses, labelClasses, valueClasses]
    }

    this.mapValue = (label: string, val: number): string => {
      if (label == "In zone:") {
        if (val >= 1) {
          return "Light";
        } else if (val == 0) {
          return "Grey";
        } else {
          return "Dark";
        }
      }
      
      if (label == "Camera:") {
        if (val >= 0.95) return "On";
        return "Off";
      }
      return val.toString();
    }
  }

  private getSatStatsSet = (satNumber: number): StatsSubsystemMod.Stats => {
      var state = this.gameManager.resObject.getDataStateArray(satNumber);

      return {
        longArrays: [],
        shortArrays: [
          (<ResultObject2015> this.gameManager.resObject).getEnergy(satNumber),
          (<ResultObject2015> this.gameManager.resObject).getCameraOn(satNumber),
          (<ResultObject2015> this.gameManager.resObject).getMemoryFilled(satNumber),
          (<ResultObject2015> this.gameManager.resObject).getLightStatusData(satNumber)
        ]
      }
  }
}

export = GameSpecificStatsSubsystem;
