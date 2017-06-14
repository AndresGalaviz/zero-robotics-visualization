/// <reference path="../../CommonImports.ts"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

import Mappings2017HS = require("../../mappings/Mappings2017HS");
import ResultObject2017HS = Mappings2017HS.ResultObject2017HS;

class AnalyzerSubsystem implements Subsystem {
	private gameManager : GameManager;

	constructor(gameManager: GameManager) {
		this.gameManager = gameManager;
	}

	init = () => {
		var result = (<ResultObject2017HS> this.gameManager.resObject); //Uses 2016 Result Object
		this.setupMeshes();
	}

	update = (dt:number, time:number, paused:boolean) => {
	}

	play = (time: number) => {
	}

	togglePause = (paused:boolean, resumeTime:number) => {
	}

	changeSpeed = (speed:number):void => { //play, togglePause, changeSpeed needed b/c of interface, no functionality
	}

	private setupMeshes = () => {
		var geom = new THREE.SphereGeometry(10, 32, 32);
    	var material = new THREE.MeshBasicMaterial({
			color: 0xf4e842,
			transparent: true,
			opacity: 0.2 
			});
    	var mesh = new THREE.Mesh(geom, material);
    	this.gameManager.scene.add(mesh);
		var pos = [22.16,33.18,27.70];
		mesh.position.fromArray(pos);
		var geom = new THREE.SphereGeometry(10, 32, 32);
    	var material = new THREE.MeshBasicMaterial({
			color: 0xf4e842,
			transparent: true,
			opacity: 0.2 
			});
    	var mesh = new THREE.Mesh(geom, material);
    	this.gameManager.scene.add(mesh);
		var pos = [-22.16,-33.18,-27.70];
		mesh.position.fromArray(pos);
	}
}

export = AnalyzerSubsystem;
