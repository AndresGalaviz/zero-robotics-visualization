import Config = require("./ConfigModule");
/// <reference path="./CommonImports"/>

var scene, WIDTH, HEIGHT, renderer, camera, controls, scene, sphere1, sphere2, sphereAnimate, geometry;

var stats, pauseTime;
var sphereZeroMesh, sphereOneMesh;
var JSONObj:any;

import Subsystem = require("./Subsystem");
import Results = require("./Results");
import IExtendedResultObject = Results.IExtendedResultObject;
import ResultObject = Results.ResultObject;
import Helpers = require("./Helpers");

import SatelliteSubsystem = require("./subsystems/base/SatelliteSubsystem");

class GameManager {
  private clock : THREE.Clock;
  private renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  private controls: THREE.OrbitControls;
  scene: THREE.Scene;
  private ambientLight: THREE.AmbientLight;

  private skybox: THREE.Mesh;
  private basicSkybox = false;
  private skyboxScene: THREE.Scene;

  resObject: IExtendedResultObject;

  subsystems: {[index: string]: Subsystem}; //dictionary where the keys are the names of our subsystems 

  private animationSpeed: number;
  private animationTime: number;
  pauseTime: number;
  paused = true;
  initialized = false;

  resourcePath = "/static/";

  private static gameManager: GameManager;

  private pauseToggleCallback: (GameManager) => void;

  callOnSubsystems(fn: string, ...args: any[]) {
    var subsystemKeys = Object.keys(this.subsystems);
    for (var i = 0; i < subsystemKeys.length; i++) {
      var key = subsystemKeys[i];
      this.subsystems[key][fn].apply(null, args);
    }
  }

  constructor(resObject : IExtendedResultObject) {
    GameManager.gameManager = this; // singleton

  	//Width and height of the scene - should be dynamic

  	WIDTH = $("#canvasContainer").width();
  	HEIGHT = WIDTH * 9.0/16;

    this.subsystems = {};

    this.resObject = resObject;

    this.clock = new THREE.Clock();

    this.createRenderer();

    this.createCamera();

    this.createOrbitControls();

  	//Set up basics
  	this.scene = new THREE.Scene();

    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);
    //updateSpheres();
  }

  onResize() {
    WIDTH = $("#canvasContainer").width();
  	HEIGHT = WIDTH * 9.0/16;
    if (this.renderer == null) return;
    this.renderer.setSize(WIDTH, HEIGHT);
  }

  init() {
    // this.skybox = Helpers.setupSkybox(this);
    this.setupSkybox();

    this.callOnSubsystems("init");
    this.initialized = true;
  }

  toggleSkybox() {
    this.basicSkybox = !this.basicSkybox;
    this.setupSkybox();
  }

  setupSkybox() {
    if (this.skybox != null) {
      this.skyboxScene.remove(this.skybox);
    }

    var fn: (gm: GameManager) => THREE.Mesh;
    if (this.basicSkybox) fn = Helpers.setupBasicSkybox;
    else fn = Helpers.setupSkybox;

    this.skybox = fn(this);
    this.skyboxScene = new THREE.Scene();
    this.skyboxScene.add(this.skybox);
  }

  createRenderer():void {
    //Create the renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      premultipliedAlpha: false,
    });
    this.renderer.autoClear = false;
    this.renderer.setSize(WIDTH, HEIGHT);
    $("#canvasContainer").append(this.renderer.domElement);
    this.renderer.setClearColor(0x0);
    this.renderer.clear();
  }

  createCamera():void {
  	this.camera = new THREE.PerspectiveCamera(45, (WIDTH)/(HEIGHT), 0.1, 10000);
  	this.camera.position.fromArray(Helpers.convertCoords(Config.Config.CamStartingPosition))
  }

  resetCamera():void {
    this.createCamera();
    this.createOrbitControls();
    this.render();
  }

  createOrbitControls():void {
  	//Mouse orbit control
  	this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  	// this.controls.damping = 0.2;
  	this.controls.addEventListener("change", this.render );
  }

  loop = (_: number, force: boolean = false) => {
    //Sets Up the next animation frame and updates the other related items
      if (!force) requestAnimationFrame(this.loop);
      var delta = this.clock.getDelta();
      THREE.AnimationHandler.update( delta );
      this.callOnSubsystems("update", delta, this.getTime(), this.paused);

      this.render();
  }

  render = () => {
    this.renderer.clear();
    this.skybox.position.copy(this.camera.position);
    this.renderer.render(this.skyboxScene, this.camera);
    this.renderer.render(this.scene, this.camera);
  }

  //Speed up or slow down the animation
  changeSpeed(speed:number):void{
    this.animationSpeed = speed;
    this.callOnSubsystems("changeSpeed", speed);
  }

  //Plays the animation from the given start time
  play = (time?:number) => {
    if (time == null) {
      time = 0;
    }

    if (this.paused) {
      this.togglePause();
    }
    this.callOnSubsystems("play", time);
    this.animationTime = time;
  }

  reset = () => {
    this.resetCamera();
    this.play(0);
  }

  getTime = ():number => {
    // time is based on the three.js animation system
    return (<SatelliteSubsystem> this.getSubsystem("satelliteSubsystem")).getTime();
  }

  getEndTime = ():number => {
    return (<SatelliteSubsystem> this.getSubsystem("satelliteSubsystem")).getEndTime();
  }

  getSubsystem = (name:string):Subsystem => {
    if (!(name in this.subsystems)) {
      throw "Trying to access a subsystem that wasn't added";
    }

    return this.subsystems[name];
  }

  getSatelliteSubsystem = ():SatelliteSubsystem => {
    return <SatelliteSubsystem>this.getSubsystem("satelliteSubsystem");
  }

  //Pauses the animation
  togglePause = () => {
    if(!this.paused) {
      this.pauseTime = this.getTime();
    }

    this.paused = !this.paused;

    this.callOnSubsystems("togglePause", this.paused, this.pauseTime);
    if (this.pauseToggleCallback != null) {
      this.pauseToggleCallback(this);
    }
  }

  pause = () => {
    if (!this.paused) {
      this.togglePause();
    }
  }

  unpause = () => {
    if (this.paused) {
      this.togglePause();
    }
  }

  setCallbackOnPause(fn:(GameManager) => void) {
    this.pauseToggleCallback = fn;
  }
}

export = GameManager;
