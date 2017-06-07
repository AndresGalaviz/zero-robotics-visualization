/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import SatelliteSubsystem = require("../base/SatelliteSubsystem");

import ResultsModule2015 = require("../../mappings/Mappings2015");
import ResultObject2015 = ResultsModule2015.ResultObject2015;

class PhotoSubsystem implements Subsystem {
  private gameManager : GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  private outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFF66,
    // transparent: true,
    // opacity: 0.4,
    wireframe: true
  });

  private sphereZeroOutline: THREE.Mesh;
  private sphereOneOutline: THREE.Mesh;

  private sphereZeroPictureUploadedData: number[];
  private sphereZeroLastStatus = 0;

  private sphereOnePictureUploadedData: number[];
  private sphereOneLastStatus = 0;

  private satSubsystem: SatelliteSubsystem;
  private resObject: ResultObject2015;

  init = () => {
    this.satSubsystem = <SatelliteSubsystem> this.gameManager.getSubsystem("satelliteSubsystem");

    var outline = new THREE.SphereGeometry(40, 4, 4 );
    this.sphereZeroOutline = new THREE.Mesh(outline, this.outlineMaterial);
    this.sphereOneOutline = new THREE.Mesh(outline.clone(), this.outlineMaterial);

    this.gameManager.scene.add(this.sphereZeroOutline);
    this.gameManager.scene.add(this.sphereOneOutline);

    this.resObject = <ResultObject2015> this.gameManager.resObject;
    this.sphereZeroPictureUploadedData = this.resObject.getPictureUploadedData(0);
    this.sphereOnePictureUploadedData = this.resObject.getPictureUploadedData(1);
  }

  update = (dt:number, time:number, paused:boolean) => {
    var index = this.resObject.getShortIndexByTime(time);

    var sphereZeroNewStatus = this.sphereZeroPictureUploadedData[index];
    var sphereOneNewStatus = this.sphereOnePictureUploadedData[index];

    this.sphereZeroOutline.visible = (sphereZeroNewStatus == 1);
    this.sphereOneOutline.visible = (sphereOneNewStatus == 1);

    if (sphereZeroNewStatus != this.sphereZeroLastStatus) {
        this.moveToSphere(this.sphereZeroOutline, this.satSubsystem.sphereZeroMesh);
    }
    if (sphereOneNewStatus != this.sphereOneLastStatus) {
        this.moveToSphere(this.sphereOneOutline, this.satSubsystem.sphereOneMesh);
    }

    this.sphereZeroOutline.scale.set(time - Math.floor(time), time - Math.floor(time), time - Math.floor(time));
    this.sphereOneOutline.scale.set(time - Math.floor(time), time - Math.floor(time), time - Math.floor(time));

    this.sphereZeroLastStatus = sphereZeroNewStatus;
    this.sphereOneLastStatus = sphereOneNewStatus;
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }

  private moveToSphere(outlineMesh: THREE.Mesh, sphereMesh: THREE.Mesh) {
    outlineMesh.position.copy(sphereMesh.position);
    /*outlineMesh.rotation.copy(sphereMesh.rotation);*/
  }
}

export = PhotoSubsystem;
