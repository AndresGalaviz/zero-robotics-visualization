import GameManager = require("./GameManager");

import Results = require("./Results");
import ResultObject = Results.ResultObject;
import SimData = Results.SimData;
import IExtendedResultObject = Results.IExtendedResultObject;

import DebugTextSubsystem = require("./subsystems/base/DebugTextSubsystem");
import TimeSubsystem = require("./subsystems/base/TimeSubsystem");
import AxisSubsystem = require("./subsystems/base/AxisSubsystem");
import ScoreNotificationSubsystem = require("./subsystems/base/ScoreNotificationSubsystem");
import ItemSubsystem = require("./subsystems/2016HS/ItemSubsystem");

import ZoneSubsystem = require("./subsystems/2016HS/ZoneSubsystem");
import ProgressBarSubsystem = require("./subsystems/base/ProgressBarSubsystem");
import SatelliteSubsystem = require("./subsystems/base/SatelliteSubsystem");
import StatsSubsystem = require("./subsystems/base/BaseStatsSubsystem");

import GameSpecificStatsSubsystem = require("./subsystems/2016HS/GameSpecificStatsSubsystem");
import OutOfBoundsSubsystem = require("./subsystems/base/OutOfBoundsSubsystem");
import ConfigModule = require("./ConfigModule");

module ZR {
  
  function initConfig():void {
    if (window['VisualizationConfig'] != null) {
      ConfigModule.Set(window['VisualizationConfig']);
    } 
  }

  function loadResult(url:string, callback: (result:ResultObject) => void) {
    $.getJSON(url, (data) => {
      callback(ConfigModule.GetResultObject(<SimData> data));
    });
  }

  export function init(cb: (gm:GameManager) =>{}):void {
    THREE.ImageUtils.crossOrigin = 'anonymous';
    initConfig();
    var gm;
    if (window['simData'] != null) {
      var data = JSON.parse(window['simData']);
      var resObject = ConfigModule.GetResultObject(<SimData> data);
      gm = startVis(resObject);
      cb(gm);      
      gm.init();
      gm.play();
      gm.loop();
    } 
    else loadResult("json/results.json", (resObject : IExtendedResultObject) => {      
      gm = startVis(resObject);
      cb(gm);      
      console.log("done");
      gm.init();
      gm.play();
      gm.loop();
    });
  };

  function startVis(resObject: IExtendedResultObject) : GameManager {
    var gameManager = new GameManager(resObject);
    
    // Initialize basic subsystems that will be used every year
    gameManager.subsystems["satelliteSubsystem"] = new SatelliteSubsystem(gameManager);
    gameManager.subsystems["axisSubsystem"] = new AxisSubsystem(gameManager);
    gameManager.subsystems["coreNotificationSubsystem"] = new ScoreNotificationSubsystem(gameManager);
    gameManager.subsystems["statsSubsystem"] = new StatsSubsystem(gameManager);
    gameManager.subsystems["timeSubsystem"] = new TimeSubsystem(gameManager);
    gameManager.subsystems["progressBarSubsystem"] = new ProgressBarSubsystem(gameManager);
    gameManager.subsystems["debugTextSubsystem"] = new DebugTextSubsystem(gameManager);
    gameManager.subsystems["outOfBoundsSubsystem"] = new OutOfBoundsSubsystem(gameManager);
    
    // Year specific subsystems have to be added by specific year's resobjects
    resObject.setupGameManager(gameManager);
    
    return gameManager;
  }
}

export = ZR
