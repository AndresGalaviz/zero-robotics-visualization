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

  private frustumMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFF66,
    // transparent: true,
    // opacity: 0.4,
    wireframe: true
  });

  private sphereZeroFrustum: THREE.Mesh;
  private sphereOneFrustum: THREE.Mesh;

  private sphereZeroPictureTakenData: number[];
  private sphereZeroLastStatus = 0;

  private sphereOnePictureTakenData: number[];
  private sphereOneLastStatus = 0;

  private satSubsystem: SatelliteSubsystem;
  private resObject: ResultObject2015;

  init = () => {
    this.satSubsystem = <SatelliteSubsystem> this.gameManager.getSubsystem("satelliteSubsystem");

    var cone = Helpers.constructCone(0.25, 100);
    this.sphereZeroFrustum = new THREE.Mesh(cone, this.frustumMaterial);
    this.sphereOneFrustum = new THREE.Mesh(cone.clone(), this.frustumMaterial);

    this.gameManager.scene.add(this.sphereZeroFrustum);
    this.gameManager.scene.add(this.sphereOneFrustum);

    this.resObject = <ResultObject2015> this.gameManager.resObject;
    this.sphereZeroPictureTakenData = this.resObject.getPictureTakenData(0);
    this.sphereOnePictureTakenData = this.resObject.getPictureTakenData(1);
  }

  update = (dt:number, time:number, paused:boolean) => {
    var index = this.resObject.getShortIndexByTime(time);

    var sphereZeroNewStatus = this.sphereZeroPictureTakenData[index];
    var sphereOneNewStatus = this.sphereOnePictureTakenData[index];

    this.sphereZeroFrustum.visible = (sphereZeroNewStatus == 1);
    this.sphereOneFrustum.visible = (sphereOneNewStatus == 1);

    if (sphereZeroNewStatus != this.sphereZeroLastStatus) {
        this.moveToSphere(this.sphereZeroFrustum, this.satSubsystem.sphereZeroMesh);
    }
    if (sphereOneNewStatus != this.sphereOneLastStatus) {
        this.moveToSphere(this.sphereOneFrustum, this.satSubsystem.sphereOneMesh);
    }

    this.sphereZeroLastStatus = sphereZeroNewStatus;
    this.sphereOneLastStatus = sphereOneNewStatus;
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }

  private moveToSphere(frustumMesh: THREE.Mesh, sphereMesh: THREE.Mesh) {
    frustumMesh.position.copy(sphereMesh.position);
    frustumMesh.rotation.copy(sphereMesh.rotation);
  }
}

export = PhotoSubsystem;
