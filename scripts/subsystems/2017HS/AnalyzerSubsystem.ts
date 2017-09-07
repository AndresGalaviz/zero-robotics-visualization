/// <reference path="../../CommonImports.ts"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import Constants = require("../../Constants");
import Mappings2017HS = require("../../mappings/Mappings2017HS");
import ResultObject2017HS = Mappings2017HS.ResultObject2017HS;

class AnalyzerSubsystem implements Subsystem {
	private gameManager : GameManager;
	private analyzerRadius = Constants.Y2017HS.analyzerRadius;
	private resObject: ResultObject2017HS;
	private analyzer1Mesh: THREE.Mesh;
	private analyzer2Mesh: THREE.Mesh;
	private analyzer1: number[]; 
	private analyzer2: number[]; //positions of our two analyzers 
	private analyzer1Array: number[];
	private analyzer2Array: number[];
	private flag1: boolean;
	private flag2: boolean;

	constructor(gameManager: GameManager) {
		this.gameManager = gameManager;
	}

	init = () => {
		 this.resObject = (<ResultObject2017HS> this.gameManager.resObject); //Uses 2016 Result Object
		 this.analyzer1 = this.resObject.getAnalyzer1();
		 this.analyzer2 = this.resObject.getAnalyzer2(); //intializing position 
		this.analyzer1Mesh = this.setupMeshes(this.analyzer1,0xf4e842);
		this.analyzer2Mesh = this.setupMeshes(this.analyzer2,0xf4e842); //adding analyzers to the scene
		this.analyzer1Array = (<ResultObject2017HS> this.gameManager.resObject).getAnalyzer(0);	//length is 204
		this.analyzer2Array = (<ResultObject2017HS> this.gameManager.resObject).getAnalyzer(1);	
		this.flag1 = true;
		this.flag2 = true;
	}

	update = (dt:number, time:number, paused:boolean) => {		
		var int_time = Math.floor(time);
		if((this.analyzer2Array[int_time]%2==1 || this.analyzer1Array[int_time]%2==1)&&this.flag1)//checks if one or three
			this.gameManager.scene.remove(this.analyzer1Mesh); //the flag is so we don't constantly try to remove b/c we take the floor of the time variable (which updates more than once a second)
		if((this.analyzer2Array[int_time]>=2||this.analyzer1Array[int_time]>=2)&&this.flag2)
			this.gameManager.scene.remove(this.analyzer2Mesh);
	}

	play = (time: number) => {
	}

	togglePause = (paused:boolean, resumeTime:number) => {
	}

	changeSpeed = (speed:number):void => { //play, togglePause, changeSpeed needed b/c of interface, no functionality
	}

	private setupMeshes = (position:number[],color:number):THREE.Mesh => {
		var geom = new THREE.SphereGeometry(this.analyzerRadius, 32, 32);
    	var material = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.2 
			});
    	var mesh = new THREE.Mesh(geom, material);
    	this.gameManager.scene.add(mesh);
		mesh.position.fromArray(position);
		return mesh;
	}

}

export = AnalyzerSubsystem;
