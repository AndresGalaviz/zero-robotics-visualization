/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

export interface Stats {
  longArrays: number[][];
  shortArrays: number[][];
}

export interface Labels {

  longArrayLabels: string[];
  shortArrayLabels: string[];
}


interface StatsNode {
  label: string,
  value: string,
  containerClasses: string[],
  labelClasses: string[],
  valueClasses: string[],
}

// Warning: this class contains optimized code that might be hard to read.
// High-level overview:
// short array -> one element per second -> comm messages
// long array -> more than one element per second -> state data
//
// needsUpdating() determines if updated stats are available
// for this timestep.
//
// getStatsAsNodes() returns an array of stats nodes. 
// 
// update() checks if nodes need to be updated and does so if they do.

export class StatsSubsystem {

  private sphereZeroStats : Stats;
  private sphereOneStats : Stats;
  private labels : Labels;
  private statsBoxes : JQuery[];
  
  private prevShortIndex = -1;
  private prevLongIndex = -1;
  
  private baseContainerClasses = "stats-entry clearfix ";
  private baseLabelClasses = "stats-label ";
  private baseValueClasses = "stats-value ";

  protected gameManager : GameManager;
  protected getClasses : (string, number) => [string[], string[], string[]];
  protected mapValue : (string, number) => string;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
    this.getClasses = () => [[], [], []];
    this.mapValue = (l: string, a: number) => a.toString();
  }

  initData = (zs: Stats, os: Stats, lb: Labels, sbz: JQuery, sbo: JQuery ) => {
    this.sphereZeroStats = zs;
    this.sphereOneStats = os;
    this.labels = lb;
    this.statsBoxes = []
    this.statsBoxes.push(sbz);
    this.statsBoxes.push(sbo);
  }

  update = (dt:number, time:number, paused:boolean) => {
  if (paused || !this.needsUpdating(time)) return;
    if (this.sphereZeroStats == null || this.sphereOneStats == null || this.labels == null) {
      throw "Stats not set for stats subsystem";
    }
    
    [0, 1].forEach((sphere) => {
      var statsNodes = this.getStatsAsNodes(sphere, time)
      
      var oldNodes = this.statsBoxes[sphere].children()
      if (oldNodes.length != statsNodes.length) {
        this.statsBoxes[sphere].html(this.statsNodesToString(statsNodes));
        return;
      }
      
      statsNodes.forEach((node, idx) => {
        var oldNode = oldNodes[idx];
        if ((<any>oldNode.lastChild).textContent == node.value) return;
        // I shouldn't need <any> here. A typescript compiler bug?
        (<any>oldNode.lastChild).textContent = node.value;
        oldNode.className = this.baseContainerClasses +
          "stats-entry-"+node.label.toLowerCase().replace(/\W/g, '') + " " +
          node.containerClasses.join(" ");
        // }
        (<any>oldNode.firstChild).className = this.baseLabelClasses + node.labelClasses.join(" ");
        (<any>oldNode.lastChild).className = this.baseValueClasses + node.valueClasses.join(" ");
      });
    });
  }
  
  needsUpdating = (time: number):boolean => {
    var newLongIndex = this.gameManager.resObject.getLongIndexByTime(time);
    var newShortIndex = this.gameManager.resObject.getShortIndexByTime(time);
    
    if (newLongIndex != this.prevLongIndex || newShortIndex != this.prevShortIndex) {
      this.prevLongIndex = newLongIndex;
      this.prevShortIndex = newShortIndex;
      return true;
    }
    
    return false
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }
  

  private getStatsAsNodes = (satNumber:number, time: number):StatsNode[] => {
    var stats;
    if (satNumber == 0) {
      stats = this.sphereZeroStats;
    } else {
      stats = this.sphereOneStats;
    }
    
    var res:StatsNode[] = [];

    var longArrayIndex = this.gameManager.resObject.getLongIndexByTime(time);
    for (var i = 0; i < stats.longArrays.length; i++) {
      var label = this.labels.longArrayLabels[i];

      var value = stats.longArrays[i][longArrayIndex];
      value = parseFloat(value).toFixed(3);
      var [containerClasses, labelClasses, valueClasses] = this.getClasses(label, value)
      value = this.mapValue(label, value)
      res.push({label: label, value: value, containerClasses: containerClasses,
        labelClasses: labelClasses, valueClasses: valueClasses});
    }

    var shortArrayIndex = this.gameManager.resObject.getShortIndexByTime(time);
    for (var i = 0; i < stats.shortArrays.length; i++) {
      var label = this.labels.shortArrayLabels[i];

      var value = stats.shortArrays[i][shortArrayIndex];
      value = parseFloat(value).toFixed(3);
      var [containerClasses, labelClasses, valueClasses] = this.getClasses(label, value)
      value = this.mapValue(label, value)
      res.push({label: label, value: value, containerClasses: containerClasses,
        labelClasses: labelClasses, valueClasses: valueClasses});
    }

    return res;
  }
  
  private statsNodesToString(n:StatsNode[]):string {
    var str = "";
    for(var i = 0; i < n.length; i++) {
      var node = n[i];
      str += this.getEntryHtml(node.label, node.value,
        node.containerClasses, node.labelClasses, node.valueClasses);
    }
    
    return str;
  }

  private getEntryHtml(label:string, value: string, containerClasses?:string[],
    labelClasses?:string[], valueClasses?:string[]) {

    var containerClassesString = "";
    if (containerClasses != null) containerClassesString = containerClasses.join(" ");

    var labelClassesString = "";
    if (labelClasses != null) labelClassesString = labelClasses.join(" ");

    var valueClassesString = "";
    if (valueClasses != null) valueClassesString = valueClasses.join(" ");

    return "<div class='stats-entry "+containerClasses+" stats-entry-"+label.toLowerCase().replace(/\W/g, '')
    +" clearfix'><span class='stats-label "+labelClassesString+"'>"+label
    +"</span><span class='stats-value "+valueClassesString+"'>"+value
    +"</span></div>";
  }
}
