import Constants = require("../../Constants");
/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import StatsSubsystemMod = require("../template/StatsSubsystem");
import SatelliteSubsystem = require("./SatelliteSubsystem");
import StatsSubsystem = StatsSubsystemMod.StatsSubsystem;
import Results = require("../../Results");
import IExtendedResultObject = Results.IExtendedResultObject;
import Results2016HS = require("../../mappings/Mappings2016HS");
import ResultObject2016HS = Results2016HS.ResultObject2016HS;

var textMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );

class ScoreNotificationSubsystem implements Subsystem {  
  gameManager: GameManager;
  sphereScores: number[][] = [];
   
  private sphereNotifications: NotificationObject[] = [];
  notifiedTurn: number[] = [0, 0];
    
  satSubsystem: SatelliteSubsystem;
  
  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {    
    this.satSubsystem = <SatelliteSubsystem> this.gameManager.getSubsystem("satelliteSubsystem");
    [0, 1].forEach((sphere) => {
      this.sphereScores.push((<IExtendedResultObject> this.gameManager.resObject).getScore(sphere));
    });
  }
  
  update = (dt:number, time:number, paused:boolean) => {
      var idx = this.gameManager.resObject.getShortIndexByTime(time);
      if (idx < 2) return;
      
      [0, 1].forEach((sphere) => {
        var [currScore, prevScore] = [this.sphereScores[sphere][idx], this.sphereScores[sphere][idx-1]]
        if (currScore == prevScore || this.notifiedTurn[sphere] == Math.floor(time)) return;
        
        var satObject:THREE.Mesh;
        if (sphere == 0) satObject = this.satSubsystem.sphereZeroMesh
        else satObject = this.satSubsystem.sphereOneMesh
		var diff = (currScore - prevScore);
		if(Math.abs(diff - (<ResultObject2016HS>this.gameManager.resObject).getPointsPerSecond(sphere)[idx-1]) < 0.001) return; // TODO do this within 2016 subsystems. remove this line if still exists in 2017
		var newObject = new NotificationObject(satObject, this.gameManager, (diff > 0 ? "+" : "") + diff.toFixed(2), time);        
            
        this.sphereNotifications.push(newObject);   
        this.notifiedTurn[sphere] = Math.floor(time);
      });
      
      this.sphereNotifications = this.sphereNotifications.filter((not, idx):boolean => {
        not.update(time);
        if (time < not.endsAt) return true;
        not.destroy();
        return false;
      });
  }
  
  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }
}

class NotificationObject {
  mesh: THREE.Mesh;
  above: THREE.Object3D;
  gm: GameManager;
  endsAt: number;
  startedAt: number;
  
  height: number;
  offset: number;
  
  constructor(above: THREE.Object3D, gm: GameManager, s: string, startedAt: number) {
    this.above = above;
    this.endsAt = startedAt + 2;
    this.startedAt = startedAt;
    this.gm = gm;
    
    this.mesh = constructScoreMesh(s);
    this.gm.scene.add(this.mesh);
    this.update(startedAt);
    
    this.height = 10;
    this.offset = 20;
  }
    
  update(time: number) {
    this.mesh.rotation.copy(this.gm.camera.rotation);
    var prop = (time - this.startedAt)/(this.endsAt - this.startedAt);
    var posDiff = Constants.UP.clone().multiplyScalar(this.offset + this.height*prop);        
    this.mesh.position.copy(this.above.position.clone().add(posDiff));    
  }
  
  destroy() {
    this.gm.scene.remove(this.mesh);    
  }
}

function constructScoreMesh (s: string) {    
    var geom = new THREE.TextGeometry(s, {
      size: 5,
      height: 0.2,
    });
    geom.computeBoundingBox();
    var c = geom.boundingBox.center();
    geom.applyMatrix( new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.y));
    
    return new THREE.Mesh(geom, textMaterial);
}

export = ScoreNotificationSubsystem;
