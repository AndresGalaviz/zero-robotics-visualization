/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

class AxisSubsystem implements Subsystem {
  private gameManager : GameManager;

  private axes: THREE.Group;
  private corners: THREE.Group;

  private textMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );

  private axisNames: THREE.Group;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
    this.constructAxes();
    this.constructCorners();
    this.gameManager.scene.add(this.axes);
    this.gameManager.scene.add(this.corners);

    var options = {
      size: 5,
      height: 2,
    };

    this.axisNames = new THREE.Group();

    var x = new THREE.TextGeometry("X", options);
    var xObject = new THREE.Mesh(x, this.textMaterial);
    xObject.position.fromArray(Helpers.convertCoords([0.5, 0, 0]));
    this.axisNames.add(xObject);

    var y = new THREE.TextGeometry("Y", options);
    var yObject = new THREE.Mesh(y, this.textMaterial);
    yObject.position.fromArray(Helpers.convertCoords([0, 0.5, 0]));
    this.axisNames.add(yObject);

    var z = new THREE.TextGeometry("Z", options);
    var zObject = new THREE.Mesh(z, this.textMaterial);
    zObject.position.fromArray(Helpers.convertCoords([0, 0, 0.5]));
    this.axisNames.add(zObject);

    this.gameManager.scene.add(this.axisNames);
  }

  update = (dt:number, time:number, paused:boolean) => {
    this.faceCamera();
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }  

  private faceCamera = () => {
    this.axisNames.children.forEach((ch) => {
      ch.rotation.copy(this.gameManager.camera.rotation);
    });
  }

  private constructCorners = () => {
    var result = new THREE.Group();
    var pX = 64;
    var pY = 64;
    var pZ = 80;
    var cornerSize = 10;
    var color = 0xff0000;

    result.add(Helpers.constructLine(color, pX, pY, pZ, pX, pY, pZ - 10));
    result.add(Helpers.constructLine(color, pX, pY, pZ, pX, pY - 10, pZ));
    result.add(Helpers.constructLine(color, pX, pY, pZ, pX - 10, pY, pZ));

    result.add(Helpers.constructLine(color, pX, pY, -pZ, pX, pY, -pZ + 10));
    result.add(Helpers.constructLine(color, pX, pY, -pZ, pX, pY - 10, -pZ));
    result.add(Helpers.constructLine(color, pX, pY, -pZ, pX - 10, pY, -pZ));

    result.add(Helpers.constructLine(color, pX, -pY, pZ, pX, -pY, pZ - 10));
    result.add(Helpers.constructLine(color, pX, -pY, pZ, pX, -pY + 10, pZ));
    result.add(Helpers.constructLine(color, pX, -pY, pZ, pX - 10, -pY, pZ));

    result.add(Helpers.constructLine(color, pX, -pY, -pZ, pX, -pY, -pZ + 10));
    result.add(Helpers.constructLine(color, pX, -pY, -pZ, pX, -pY + 10, -pZ));
    result.add(Helpers.constructLine(color, pX, -pY, -pZ, pX - 10, -pY, -pZ));

    result.add(Helpers.constructLine(color, -pX, pY, pZ, -pX, pY, pZ - 10));
    result.add(Helpers.constructLine(color, -pX, pY, pZ, -pX, pY - 10, pZ));
    result.add(Helpers.constructLine(color, -pX, pY, pZ, -pX + 10, pY, pZ));

    result.add(Helpers.constructLine(color, -pX, pY, -pZ, -pX, pY, -pZ + 10));
    result.add(Helpers.constructLine(color, -pX, pY, -pZ, -pX, pY - 10, -pZ));
    result.add(Helpers.constructLine(color, -pX, pY, -pZ, -pX + 10, pY, -pZ));

    result.add(Helpers.constructLine(color, -pX, -pY, pZ, -pX, -pY, pZ - 10));
    result.add(Helpers.constructLine(color, -pX, -pY, pZ, -pX, -pY + 10, pZ));
    result.add(Helpers.constructLine(color, -pX, -pY, pZ, -pX + 10, -pY, pZ));

    result.add(Helpers.constructLine(color, -pX, -pY, -pZ, -pX, -pY, -pZ + 10));
    result.add(Helpers.constructLine(color, -pX, -pY, -pZ, -pX, -pY + 10, -pZ));
    result.add(Helpers.constructLine(color, -pX, -pY, -pZ, -pX + 10, -pY, -pZ));

    this.corners = result;
  }

  private constructAxes = () => {
    var result = new THREE.Group();
    var color = 0xff0000;

    //Make axes lines
    var axesEndPoints = [64, 64, 80];
    result.add(Helpers.constructLine(color, -axesEndPoints[0],0,0,axesEndPoints[0],0,0));
    result.add(Helpers.constructLine(color, 0,-axesEndPoints[1],0,0,axesEndPoints[1],0));
    result.add(Helpers.constructLine(color, 0,0,-axesEndPoints[2],0,0,axesEndPoints[2]));

    var crossSeparation = 10;
    var crossLength = 1;
    //Drawing crosses
    //Dimension iteration
    for (var i = 0; i <= 2; i++) {
      var crossLimitOneSide = Math.round(axesEndPoints[i] / crossSeparation);
      //Axes iteration
      for (var j = -crossLimitOneSide; j <= crossLimitOneSide; j++){
        var crossGeometry = new THREE.Geometry();
        //X
        if (i == 0){
          result.add(Helpers.constructLine(color, j * crossSeparation, 0, -crossLength, j * crossSeparation, 0, crossLength));
          result.add(Helpers.constructLine(color, j * crossSeparation, -crossLength, 0, j * crossSeparation, crossLength, 0));
        }
        //Y
        if (i==1){
          result.add(Helpers.constructLine(color, 0, j * crossSeparation, -crossLength, 0, j * crossSeparation, crossLength));
          result.add(Helpers.constructLine(color, -crossLength, j * crossSeparation, 0, crossLength, j * crossSeparation, 0));
        }
        //Z
        if (i==2){
          result.add(Helpers.constructLine(color, 0, -crossLength, j * crossSeparation, 0, crossLength, j * crossSeparation));
          result.add(Helpers.constructLine(color, -crossLength, 0, j * crossSeparation, crossLength, 0, j * crossSeparation));
        }
      }
    }

    this.axes = result;
  }
}

export = AxisSubsystem;
