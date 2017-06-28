/// <reference path="../../CommonImports.ts"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

import Mappings2017HS = require("../../mappings/Mappings2017HS");
import GameType = Mappings2017HS.GameType;
import ResultObject2017HS = Mappings2017HS.ResultObject2017HS;

class SampleSubsystem implements Subsystem {
	private itemMeshes: THREE.Mesh[] = new Array(9);
	private itemAnims: THREE.Animation[] = new Array(9);
	private itemData: {pos: number[], att: number[]}[][];

	private mpEmpty = 0x0fff;

	private gameManager : GameManager;

	constructor(gameManager: GameManager) {
		this.gameManager = gameManager;
	}

	init = () => {
		var rObj = (<ResultObject2017HS> this.gameManager.resObject);
		var animData = this.createAnimData();
		for(var i = 0; i < 9; i++) {
			var anim = new THREE.Animation(this.itemMeshes[i], animData[i]);
	   		anim.loop = false;
			this.itemAnims[i] = anim;
		}
	}

	update = (dt:number, time:number, paused:boolean) => {
		var time = this.gameManager.resObject.getShortIndexByTime(time);
		for(var i = 7; i < 9; i++) {
			if(this.itemData[i][time+1].pos[0] == 0 && this.itemData[i][time+1].pos[1] == 0 && this.itemData[i][time+1].pos[2] == 0) {
				this.itemMeshes[i].visible = false;
			} else {
				this.itemMeshes[i].visible = true;
			}
		}
	}

	play = (time: number) => {
		for(var anim of this.itemAnims) {
			anim.play(time);
		}
	}

	togglePause = (paused:boolean, resumeTime:number) => {
		if(paused) {
			for(var anim of this.itemAnims) {
				anim.stop();
			}
		} else {
			for(var anim of this.itemAnims) {
				anim.play(resumeTime);
			}
		}
	}

	changeSpeed = (speed:number):void => {
		for(var anim of this.itemAnims) {
			anim.timeScale = speed;
		}
	}
	
	private createAnimData = (): THREE.AnimationData[] => {
		var time = this.gameManager.resObject.getDataTimesArray();
		var result = new Array(9);

		for(var i = 0; i < 9; i++) {
			var state = this.itemData[i];
			var keys = new Array(state.length);
			for(var j = 0; j < state.length; j++) {
				var keyframe = {
					time: this.gameManager.resObject.getLongIndexByTime(time[j]),
					pos: Helpers.convertCoords(state[j].pos),
					rot: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1,0,0), new THREE.Vector3().fromArray(state[j].att)),
					scl: [1,1,1]
				};
				keys[j] = keyframe;
			}

			var animData = {
				name: "Action",
				fps: 25,
				length: time[time.length],
				hierarchy: [
					{
						parent: -1,
						keys: keys
					}
				]
			};

			result[i] = animData;
		}

		return <THREE.AnimationData[]> result;
	}
}

export = SampleSubsystem;
