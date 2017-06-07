/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import SatelliteSubsystem = require("./SatelliteSubsystem");

class OutOfBoundsSubsystem implements Subsystem {
  private gameManager : GameManager;

  private axes: THREE.Group;
  private corners: THREE.Group;

  private textMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );

  private axisNames: THREE.Group;
  private satSubsystem: SatelliteSubsystem;
  
  private outOfBounds: boolean[];
  private outOfBoundsContainers: JQuery[];
  private outOfBoundsClass = "blink";

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
    this.satSubsystem = this.gameManager.getSatelliteSubsystem();
    this.outOfBounds = [false, false];
    this.outOfBoundsContainers = [$("#outofboundsbox-sphere1"), $("#outofboundsbox-sphere2")]
  }

  update = (dt:number, time:number, paused:boolean) => {
    [0,1].forEach((idx) => {
      var mesh: THREE.Mesh;
      if (idx == 0) mesh = this.satSubsystem.sphereZeroMesh;
      else mesh = this.satSubsystem.sphereOneMesh;
      
      var currOutOfBounds = Helpers.outOfBounds(mesh.position.toArray());
      if (currOutOfBounds != this.outOfBounds[idx]) {
        if (currOutOfBounds) this.outOfBoundsContainers[idx].addClass(this.outOfBoundsClass)
        else this.outOfBoundsContainers[idx].removeClass(this.outOfBoundsClass)
      }
      
      this.outOfBounds[idx] = currOutOfBounds;      
    });    
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }

}

export = OutOfBoundsSubsystem;
