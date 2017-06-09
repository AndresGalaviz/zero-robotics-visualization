/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

import Mappings2017HS = require("../../mappings/Mappings2017HS");
import ItemType2017HS = Mappings2017HS.ItemType2017HS;
import GameType = Mappings2017HS.GameType;
import ResultObject2016HS = Mappings2017HS.ResultObject2017HS;

class ItemSubsystem implements Subsystem {
	private itemMeshes: THREE.Mesh[] = new Array(9);
	private itemAnims: THREE.Animation[] = new Array(9);
	private itemData: {pos: number[], att: number[], type: Mappings2017HS.ItemType2017HS}[][];

	private mpEmpty = 0x0fff;

	private gameManager : GameManager;

	constructor(gameManager: GameManager) {
		this.gameManager = gameManager;
	}

	init = () => {
		var rObj = (<ResultObject2016HS> this.gameManager.resObject);
		this.itemData = rObj.getItemData();
	    
		this.setupItems();
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

	private setupItems = () => {
		for (var i = 0; i < 9; i++) {
			var item = this.itemData[i][0];
			var size;
			var color;
			var geometry;
			var material;
			switch (item.type) {
				case Mappings2016HS.ItemType2016HS.Large:
					color = 0xffff00;
					size = 9;
					break;
				case Mappings2016HS.ItemType2016HS.Medium:
					color = 0xff00ff;
					size = 7;
					break;
				case Mappings2016HS.ItemType2016HS.Small:
					color = 0x00ffff;
					size = 5;
					break;
				case Mappings2016HS.ItemType2016HS.Receiver:
					color = 0xffa500;
					size = 3;
					geometry = new THREE.CylinderGeometry(0,size,size,4,1,false);
					material = new THREE.MeshBasicMaterial({color: color});
					break;
				case Mappings2016HS.ItemType2016HS.Special:
					color = 0x4b0082;
					size = 5;
					break;
				default:
					throw "Shouldn't get here";
			}

			if (item.type != Mappings2016HS.ItemType2016HS.Receiver) {
				geometry = new THREE.BoxGeometry(size, size, size);
				for(var face of geometry.faces) {
					face.color.setHex(color);
				}
				material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.FaceColors});
			}

			var mesh = new THREE.Mesh(geometry, material);

			var gameType = (<ResultObject2016HS>this.gameManager.resObject).getGameType();
			if(gameType != Mappings2016HS.GameType.ZR2D && gameType != Mappings2016HS.GameType.ZR3D && item.type != Mappings2016HS.ItemType2016HS.Receiver && item.type != Mappings2016HS.ItemType2016HS.Special) {
				var itemFace;
				itemFace = (<ResultObject2016HS> this.gameManager.resObject).getFace(i);
				mesh.geometry.faces[2*itemFace].color.setHex(~color);
				mesh.geometry.faces[2*itemFace+1].color.setHex(~color);
			}
			//face pairs: 0-1 2-3 4-5
			// if (item.type == Mappings2016HS.ItemType2016HS.Special) {
			// 	var colors = [0xd10000, 0xff6622, 0xffda21, 0x33dd00, 0x1133cc, 0x220066];
			// 	var names = ["red", "orange", "yellow", "green", "blue", "purple"];
			// 	for (var f = 0; f < 6; f++) {
			// 		console.log("==face " + f + "== " + names[f]);
			// 		mesh.geometry.faces[2*f].color.setHex(colors[f]);
			// 		mesh.geometry.faces[2*f+1].color.setHex(colors[f]);
			// 	}
			// }
			mesh.position.fromArray(Helpers.convertCoords(item.pos));
			this.gameManager.scene.add(mesh);
			this.itemMeshes[i] = mesh;
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

export = ItemSubsystem;
