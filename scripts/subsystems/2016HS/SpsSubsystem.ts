/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

import Mappings2016HS = require("../../mappings/Mappings2016HS");
import ResultObject2016HS = Mappings2016HS.ResultObject2016HS;

class SpsSubsystem implements Subsystem {
	private spsMeshes: THREE.Mesh[][] = [];
	private spsData: {time: number, pos: number[]}[][];

	private gameManager : GameManager;

	constructor(gameManager: GameManager) {
		this.gameManager = gameManager;
	}

	init = () => {
		var result = (<ResultObject2016HS> this.gameManager.resObject);
		this.spsData = result.getSpsDrops();
		this.setupBlueMeshes();
		this.setupRedMeshes();
	}

	update = (dt:number, time:number, paused:boolean) => {
		var time = this.gameManager.resObject.getShortIndexByTime(time);
		for(var i = 0; i < 2; i++) {
			for(var j = 0; j < this.spsData[i].length; j++) { 
				this.spsMeshes[i][j].visible = (this.spsData[i][j].time <= time);
			}
		}
	}

	play = (time: number) => {
	}

	togglePause = (paused:boolean, resumeTime:number) => {
	}

	changeSpeed = (speed:number):void => {
	}

	private setupBlueMeshes = () => {
		var geometry = new THREE.SphereGeometry(3,24,16);
		var material = new THREE.MeshBasicMaterial({color: 0x0ad6ff, vertexColors: THREE.FaceColors});
		this.spsMeshes[0] = [];
		for(var j = 0; j < this.spsData[0].length; j++) {
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.fromArray(Helpers.convertCoords(this.spsData[0][j].pos));
			mesh.visible = false;
			this.gameManager.scene.add(mesh);
			this.spsMeshes[0][j] = mesh;
		}
	}
	private setupRedMeshes = () => {
		var geometry = new THREE.SphereGeometry(3,24,16);
		var material = new THREE.MeshBasicMaterial({color: 0xff0000, vertexColors: THREE.FaceColors});
		this.spsMeshes[1] = [];
		for(var j = 0; j < this.spsData[1].length; j++) {
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.fromArray(Helpers.convertCoords(this.spsData[1][j].pos));
			mesh.visible = false;
			this.gameManager.scene.add(mesh);
			this.spsMeshes[1][j] = mesh;
		}
	}
}

export = SpsSubsystem;
