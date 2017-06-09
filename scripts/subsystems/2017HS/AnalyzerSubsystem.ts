/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

import Mappings2017HS = require("../../mappings/Mappings2017HS");
import ResultObject2017HS = Mappings2017HS.ResultObject2017HS;

class AnalyzerSubsystem implements Subsystem {
	private analyzerMeshes: THREE.Mesh[][] = []; 
	private analyzerData: {time: number, pos: number[]}[][]; //2D array where each element is an object with time and pos properties
	private gameManager : GameManager;

	constructor(gameManager: GameManager) {
		this.gameManager = gameManager;
	}

	init = () => {
		var result = (<ResultObject2017HS> this.gameManager.resObject); //Uses 2016 Result Object
		// this.spsData = result.getSpsDrops();
		this.setupBlueMeshes();
		this.setupRedMeshes();
	}

	update = (dt:number, time:number, paused:boolean) => {
		var time = this.gameManager.resObject.getShortIndexByTime(time);
		for(var i = 0; i < 2; i++) {
			for(var j = 0; j < this.analyzerData[i].length; j++) { 
				this.analyzerMeshes[i][j].visible = (this.analyzerData[i][j].time <= time);
			}
		}
	}

	play = (time: number) => {
	}

	togglePause = (paused:boolean, resumeTime:number) => {
	}

	changeSpeed = (speed:number):void => { //play, togglePause, changeSpeed needed b/c of interface, no functionality
	}

	private setupBlueMeshes = () => {
		var geometry = new THREE.SphereGeometry(3,24,16);
		var material = new THREE.MeshBasicMaterial({color: 0x0ad6ff, vertexColors: THREE.FaceColors});
		this.analyzerMeshes[0] = [];
		for(var j = 0; j < this.analyzerData[0].length; j++) {
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.fromArray(Helpers.convertCoords(this.analyzerData[0][j].pos));
			mesh.visible = false;
			this.gameManager.scene.add(mesh);
			this.analyzerMeshes[0][j] = mesh;
		}
	}
	private setupRedMeshes = () => {
		var geometry = new THREE.SphereGeometry(3,24,16);
		var material = new THREE.MeshBasicMaterial({color: 0xff0000, vertexColors: THREE.FaceColors});
		this.analyzerMeshes[1] = [];
		for(var j = 0; j < this.analyzerData[1].length; j++) {
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.fromArray(Helpers.convertCoords(this.analyzerData[1][j].pos));
			mesh.visible = false;
			this.gameManager.scene.add(mesh);
			this.analyzerMeshes[1][j] = mesh;
		}
	}
}

export = AnalyzerSubsystem;
