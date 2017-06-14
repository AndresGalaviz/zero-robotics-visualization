/// <reference path="../../CommonImports.ts"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import Constants = require("../../Constants");

class SatelliteSubsystem implements Subsystem {
  private sphereZeroAnim : THREE.Animation;
  sphereZeroMesh : THREE.Mesh;
  private sphereOneAnim : THREE.Animation;
  sphereOneMesh : THREE.Mesh;

  private sphereGeom : THREE.Geometry;

  private gameManager : GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
    [this.sphereZeroMesh, this.sphereZeroAnim] = this.constructSphere(0, new THREE.Geometry(), null);
    [this.sphereOneMesh, this.sphereOneAnim] = this.constructSphere(1, new THREE.Geometry(), null);
    this.gameManager.scene.add(this.sphereZeroMesh);
    this.gameManager.scene.add(this.sphereOneMesh);

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

  private constructSphere = (sphereIndex : number, geometry: THREE.Geometry,
    material: THREE.Material): [THREE.Mesh, THREE.Animation] => {

    var sphere = new THREE.Mesh( geometry.clone(), material);

    var animData = this.createAnimData(sphereIndex);

    sphere.position.set(<any> animData.hierarchy[0].keys[0].pos[0], <any> animData.hierarchy[0].keys[0].pos[1],<any> animData.hierarchy[0].keys[0].pos[2]);

    var sphereAnim = new THREE.Animation( sphere, animData);
    sphereAnim.loop = false;
    // sphereAnim.play();

    return [sphere, sphereAnim];
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
