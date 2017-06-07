/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import SatelliteSubsystem = require("../base/SatelliteSubsystem");

import ResultsModule2015 = require("../../mappings/Mappings2015");
import ResultObject2015 = ResultsModule2015.ResultObject2015;

class MirrorSubsystem implements Subsystem {
  private gameManager : GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }
  
  private sphereZeroMaterial: THREE.Material;
  private sphereOneMaterial: THREE.Material;

  private sphereZeroMirrorUsedData: number[];
  private sphereZeroLastStatus = 0;

  private sphereOneMirrorUsedData: number[];
  private sphereOneLastStatus = 0;

  private satSubsystem: SatelliteSubsystem;
  private resObject: ResultObject2015;

  init = () => {
    this.satSubsystem = <SatelliteSubsystem> this.gameManager.getSubsystem("satelliteSubsystem");
    this.resObject = <ResultObject2015>this.gameManager.resObject;

    this.sphereZeroMirrorUsedData = this.resObject.getMirrorUsedData(0);
    this.sphereOneMirrorUsedData = this.resObject.getMirrorUsedData(1);
    
    this.sphereZeroMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAFF});
    this.sphereOneMaterial = new THREE.MeshBasicMaterial({color: 0xFFAAAA});
  }

  update = (dt:number, time:number, paused:boolean) => {
    var index = this.resObject.getShortIndexByTime(time);
    
    var colorOscValue = time/2 - Math.floor(time/2);
    [0, 1].forEach((idx) => {
      var mat = idx == 0 ? this.satSubsystem.sphereZeroMesh.material
        : this.satSubsystem.sphereOneMesh.material;
      var colUpper = idx == 0 ? new THREE.Color(0xAAAAFF) : new THREE.Color(0xFFAAAA);
      var colLower = idx == 0 ? new THREE.Color(0xEEEEFF) : new THREE.Color(0xFFEEEE);
      if (mat instanceof THREE.MeshBasicMaterial) {
        (<any>mat).color.set(colLower.lerp(colUpper, colorOscValue));
        mat.update();  
      }
    });    
    
    var sphereZeroNewStatus = (this.sphereZeroMirrorUsedData[index] > 0 ? 1 : 0);
    var sphereOneNewStatus = (this.sphereOneMirrorUsedData[index] > 0 ? 1 : 0);

    if (sphereZeroNewStatus != this.sphereZeroLastStatus) {
      var t = this.sphereZeroMaterial;
      this.sphereZeroMaterial = this.satSubsystem.sphereZeroMesh.material;
      this.satSubsystem.sphereZeroMesh.material = t;
    }
    if (sphereOneNewStatus != this.sphereOneLastStatus) {
      var t = this.sphereOneMaterial;
      this.sphereOneMaterial = this.satSubsystem.sphereOneMesh.material;
      this.satSubsystem.sphereOneMesh.material = t;
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

  private moveToSphere(outlineMesh: THREE.Mesh, sphereMesh: THREE.Mesh) {
    outlineMesh.position.copy(sphereMesh.position);
    /*outlineMesh.rotation.copy(sphereMesh.rotation);*/
  }
}

export = MirrorSubsystem;
