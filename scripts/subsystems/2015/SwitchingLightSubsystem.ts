/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import Constants = require("../../Constants");

import ResultsModule2015 = require("../../mappings/Mappings2015");
import ResultObject2015 = ResultsModule2015.ResultObject2015;

class LightSubsystem implements Subsystem {
  private lightMesh: THREE.Mesh;
  private darkMesh: THREE.Mesh;
  private greyMesh: THREE.Mesh;

  private greyZoneWidth = Constants.Y2015.SwitchingLight.greyZoneWidth;
  private lightCenter = Constants.Y2015.SwitchingLight.lightCenter;
  private lightDirectionArray: number[];

  private gameManager : GameManager;
  private resObject: ResultObject2015;

  private oldLightDireciton: number;


  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
    this.resObject = <ResultObject2015> this.gameManager.resObject;

    this.lightDirectionArray = this.resObject.getLightDirectionArray(this.resObject.getMasterSphere());

    var greyZoneSize = [Constants.visSpaceDims[0], Constants.visSpaceDims[1], this.greyZoneWidth];
    this.greyMesh = this.setupZone(this.lightCenter, greyZoneSize, 0x888888, 0.2);

    var otherZoneWidth = (Constants.visSpaceDims[2] - this.greyZoneWidth) / 2;
    var otherZoneZ = Constants.visSpaceDims[2]/4 + this.greyZoneWidth/4;

    var lightZoneSize = [Constants.visSpaceDims[0], Constants.visSpaceDims[1], otherZoneWidth];
    var lightZonePos = [0, 0, otherZoneZ]; // light zone starts in positive z
    this.lightMesh = this.setupZone(lightZonePos, lightZoneSize, 0xffffff, 0.2);

    var darkZoneSize = [Constants.visSpaceDims[0], Constants.visSpaceDims[1], otherZoneWidth];
    var darkZonePos = [0, 0, -otherZoneZ];
    this.darkMesh = this.setupZone(darkZonePos, darkZoneSize, 0x000000, 0.2);

    var config = this.resObject.getLightConfig();
    this.oldLightDireciton = config.direction;
    if (config.direction == -1) {
      this.switchLight();
    }
  }

  update = (dt:number, time:number, paused:boolean) => {
    var index = this.resObject.getShortIndexByTime(time);
    var newLightDirection = this.lightDirectionArray[index];

    if (newLightDirection != this.oldLightDireciton) {
      this.switchLight();
    }

    this.oldLightDireciton = newLightDirection;
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }

  private switchLight() {
    var t = this.darkMesh.position.clone();
    this.darkMesh.position.copy(this.lightMesh.position);
    this.lightMesh.position.copy(t);
  }

  private setupZone = (position: number[], size: number[],
    color: number, opacity: number): THREE.Mesh => {
    var geom = new THREE.BoxGeometry(size[0], size[1], size[2]);
    var material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity
    });
    var mesh = new THREE.Mesh(geom, material);

    this.gameManager.scene.add(mesh);
    mesh.position.fromArray(position);

    return mesh;
  }
}

export = LightSubsystem;
