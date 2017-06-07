/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import Constants = require("../../Constants");
import ResultsModule2015 = require("../../mappings/Mappings2015");
import ResultObject2015 = ResultsModule2015.ResultObject2015;

class MovingLightSubsystem implements Subsystem {
  private leftMesh: THREE.Mesh;
  private leftGreyMesh: THREE.Mesh;
  private centerMesh: THREE.Mesh;
  private rightGreyMesh: THREE.Mesh;
  private rightMesh: THREE.Mesh;

  private darkMaterial = new THREE.MeshBasicMaterial({
    color: 0x555555,
    transparent: true,
    opacity: 0.2
  });

  private lightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2
  });

  private greyMaterial = new THREE.MeshBasicMaterial({
    color: 0x888888,
    transparent: true,
    opacity: 0.2
  });

  private greyZoneWidth = Constants.Y2015.MovingLight.greyZoneWidth;
  private otherZoneWidth = Constants.visSpaceDims[2]/2 - this.greyZoneWidth;

  private lightCenterDataArray;

  private gameManager : GameManager;
  private resObject: ResultObject2015;



  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
    this.resObject = <ResultObject2015> this.gameManager.resObject;
  }

  init = () => {
    this.lightCenterDataArray = this.resObject.getLightCenterArray(this.resObject.getMasterSphere());

    var range = [-Constants.visSpaceDims[2]/2, Constants.visSpaceDims[2]];

    var zoneInitSize = [Constants.visSpaceDims[0], Constants.visSpaceDims[1], 1];
    this.leftGreyMesh = this.setupZone([0,0,0], zoneInitSize, this.greyMaterial);
    this.rightGreyMesh = this.setupZone([0,0,0], zoneInitSize, this.greyMaterial);

    this.centerMesh = this.setupZone([0,0,0], zoneInitSize, this.lightMaterial);
    this.leftMesh = this.setupZone([0,0,0], zoneInitSize, this.darkMaterial);
    this.rightMesh = this.setupZone([0,0,0], zoneInitSize, this.darkMaterial);

    this.update(0, 0, false);
  }

  update = (dt:number, time:number, paused:boolean) => {
    var halfDepth = Constants.visSpaceDims[2]/2;
    var lightCenter = this.resObject.interpShortValueByTime(this.lightCenterDataArray, time, true);
    
    lightCenter *= Constants.scalingFactor;
    // The subsystem was written under the assumption that the light center in the results file
    // was the center of the light zone. Apparently it isn't - the center is the center of the grey zone
    // to the negative Y direction of the light zone. This line converts the data by adding 
    // the difference mod (game area width)
    lightCenter = ((lightCenter + halfDepth / 2) + halfDepth) % (2*halfDepth) - halfDepth;

    if (Math.abs(lightCenter) - halfDepth/2 - this.greyZoneWidth > 0) {
      // center is dark
      lightCenter = (lightCenter + halfDepth);
      // apparently js mod operator doesn't work nicely on negative numbers
      if (lightCenter > halfDepth) lightCenter -= halfDepth*2;
      if (lightCenter < -halfDepth) lightCenter += halfDepth*2;

      this.centerMesh.material = this.darkMaterial;
      this.leftMesh.material = this.lightMaterial;
      this.rightMesh.material = this.lightMaterial;
    } else {
      this.centerMesh.material = this.lightMaterial;
      this.leftMesh.material = this.darkMaterial;
      this.rightMesh.material = this.darkMaterial;
    }

    var centerZoneLeft = Math.max(-halfDepth, lightCenter - this.otherZoneWidth/2);
    var centerZoneRight = Math.min(halfDepth, lightCenter + this.otherZoneWidth/2);

    this.centerMesh.scale.z = (centerZoneRight - centerZoneLeft);
    this.centerMesh.position.z = (centerZoneRight + centerZoneLeft) / 2;

    var leftSpace = [-halfDepth, centerZoneLeft];
    leftSpace = this.fitInto(this.leftGreyMesh, this.greyZoneWidth, leftSpace, false);
    leftSpace = this.fitInto(this.leftMesh, this.otherZoneWidth, leftSpace, false);

    var rightSpace = [centerZoneRight, halfDepth];
    rightSpace = this.fitInto(this.rightGreyMesh, this.greyZoneWidth, rightSpace, true);
    rightSpace = this.fitInto(this.rightMesh, this.otherZoneWidth, rightSpace, true);
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }

  private setupZone = (position: number[], size: number[], material: THREE.Material): THREE.Mesh => {
    var geom = new THREE.BoxGeometry(size[0], size[1], size[2]);
    var mesh = new THREE.Mesh(geom, material);

    this.gameManager.scene.add(mesh);
    mesh.position.fromArray(position);
    return mesh;
  }

  private fitInto = (lightMesh: THREE.Mesh, width:number, emptyRange: number[], preferLeft: boolean = true): number[] => {
    var [startZ, endZ] = emptyRange;
    if (endZ <= startZ) {
      lightMesh.visible = false;
      return [startZ, startZ];
    }

    lightMesh.visible = true;

    if (endZ - startZ < width) {
      lightMesh.scale.z = (endZ - startZ);
      lightMesh.position.z = (endZ + startZ) / 2;
      return [startZ, startZ];
    }

    lightMesh.scale.z = width;
    if (preferLeft) {
      lightMesh.position.z = startZ + width/2;
      return [startZ + width, endZ];
    }

    lightMesh.position.z = endZ - width/2;
    return [startZ, endZ - width];
  }
}

export = MovingLightSubsystem;
