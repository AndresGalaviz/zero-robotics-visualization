/// <reference path="../../CommonImports.ts"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import Constants = require("../../Constants");

class SatelliteSubsystem implements Subsystem {
  private sphereZeroAnim : THREE.Animation;
  sphereZeroMesh : THREE.Mesh;
  sphereZeroDrillMesh : THREE.Mesh;

  private sphereOneAnim : THREE.Animation;
  sphereOneMesh : THREE.Mesh;
  sphereOneDrillMesh: THREE.Mesh;

  private sphereGeom : THREE.Geometry;

  private gameManager : GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
    var loader = new THREE.JSONLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(this.gameManager.resourcePath + "sphere_correct_normals.json",
      (geometry: THREE.Geometry, materials: THREE.Material[]) => {
        // debugger;
        this.sphereZeroMesh.geometry = geometry;
        this.sphereOneMesh.geometry = geometry.clone();
        this.sphereZeroMesh.material = materials[0];
        this.sphereOneMesh.material = materials[1];
      });
      
      loader.load(this.gameManager.resourcePath + "cone-3d-shape.json",
        (geometry: THREE.Geometry, materials: THREE.Material[])=>{
          console.log("geometry is: " + geometry);
            this.sphereZeroDrillMesh.geometry = geometry;
            this.sphereOneDrillMesh.geometry = geometry.clone();
            this.sphereZeroMesh.material = materials[0];
            this.sphereZeroMesh.material = materials[0];
        }
      );
    [this.sphereZeroMesh, this.sphereZeroAnim] = this.constructSphere(0, this.sphereZeroMesh.geometry,this.sphereZeroDrillMesh.geometry, null);
    [this.sphereOneMesh, this.sphereOneAnim] = this.constructSphere(1, this.sphereOneMesh.geometry,this.sphereOneDrillMesh.geometry, null);
    this.gameManager.scene.add(this.sphereZeroMesh);
    this.gameManager.scene.add(this.sphereOneMesh);

    
  }

  update = (dt:number, time:number, paused:boolean) => {}

  play = (time: number) => {
    this.sphereZeroAnim.play(time);
    this.sphereOneAnim.play(time);
  }

  togglePause = (paused:boolean, resumeTime:number) => {
    if(paused){
      this.sphereZeroAnim.stop();
      this.sphereOneAnim.stop();
    }
    else{
      this.sphereZeroAnim.play(resumeTime);
      this.sphereOneAnim.play(resumeTime);
    }
  }

  changeSpeed = (speed:number):void => {
    this.sphereZeroAnim.timeScale = speed;
    this.sphereOneAnim.timeScale = speed;
  }

  getTime = ():number => {
    return this.sphereZeroAnim.currentTime;
  }

  getEndTime = ():number => {
    return this.sphereZeroAnim.data.length;
  }

  private constructSphere = (sphereIndex : number, spheregeometry: THREE.Geometry,drillgeometry: THREE.Geometry, 
    material: THREE.Material): [THREE.Mesh, THREE.Animation] => {


  // var` ballGeo = new THREE.SphereGeometry(5,30,30);
  // var material = new THREE.MeshPhongMaterial({color: 0x0000FF}); 
  // var ball = new THREE.Mesh(ballGeo, material);
  // ball.position.y=-6;
  // var shipGeo = new THREE.ConeGeometry(2, 5, 30);
  // ball.updateMatrix();
  // shipGeo.mergeMesh(ball);
  // var ship = new THREE.Mesh(shipGeo, material);
  // scene.add(ship);` <--- This works in the ThreeJS editor need to figure out how to make it work here by finding out where the Sphere Geometry is coming from
    var sphere = new THREE.Mesh( spheregeometry.clone(), material);
    var drill = new THREE.Mesh(drillgeometry,material);
     var animData = this.createAnimData(sphereIndex);
    sphere.position.set(<any> animData.hierarchy[0].keys[0].pos[0], <any> animData.hierarchy[0].keys[0].pos[1],<any> animData.hierarchy[0].keys[0].pos[2]);

    var singleGeometry = new THREE.Geometry();
    singleGeometry.merge(sphere.geometry,sphere.matrix,0);
    singleGeometry.merge(drill.geometry,drill.matrix,0);
    var unifiedMesh = new THREE.Mesh(singleGeometry,material);
   

    // var sphereAnim = new THREE.Animation( sphere, animData);
    var sphereAnim = new THREE.Animation(unifiedMesh,animData);
    sphereAnim.loop = false;
    // sphereAnim.play();

    // return [sphere, sphereAnim];
    return [unifiedMesh,sphereAnim];
  }

  private createAnimData = (satNumber: number): THREE.AnimationData => {

    var time = this.gameManager.resObject.getDataTimesArray();

    var animData = {
      name: "Action",
      fps: 25,
      length: time[time.length-1],
      hierarchy: [
        {
          parent: -1,
          keys: this.getKeyframeArray(satNumber)
        }
      ]
    };

    return <THREE.AnimationData> animData;
  }

  private getKeyframeArray = (satNumber): Object => {
    var positionScale = Constants.scalingFactor;
    var result = [];

    var time: number[] = this.gameManager.resObject.getDataTimesArray();
    var state: number[][] = this.gameManager.resObject.getDataStateArray(satNumber);

    for (var i=0; i < time.length; i++){
        var satTime = time[i];

        var position = Helpers.convertCoords([state[0][i], state[1][i], state[2][i]]);

        // i, j, k, q
        var rotation = [
          state[6][i],
          state[7][i],
          state[8][i],
          state[9][i],
        ]

        var rotConverted = Helpers.convertQuat(new THREE.Quaternion().fromArray(rotation)).toArray();

        var keyframe = {
          time: satTime,
          pos: position,
          rot: rotConverted,
          scl: [1,1,1]
        }

        result.push(keyframe);
    }
    return result;
  }
}

export = SatelliteSubsystem;
