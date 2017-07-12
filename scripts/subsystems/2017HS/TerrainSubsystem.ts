/// <reference path="../../CommonImports.ts"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");
import Constants = require("../../Constants");
import Mappings2017HS = require("../../mappings/Mappings2017HS");
import ResultObject2017HS = Mappings2017HS.ResultObject2017HS;

class TerrainSubsystem implements Subsystem {
    private gameManager : GameManager;
    private resObject: ResultObject2017HS;

    constructor(gameManager: GameManager) {
		this.gameManager = gameManager;
	}
    init = ()=>{
        for(var i = 0;i<20;i++){
            for(var j = 0;j<16;j++){
                    //                 for(var i = 0;i<20;i++){
                    // 	for(var j = 0;j<16;j++){
                    // 	var r = Math.ceil(Math.random()*4);
                    // 	var geometry = new THREE.BoxGeometry( 1, r,1);
                    // 	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                    // 	var cube = new THREE.Mesh( geometry, material );
                    // 	cube.position.set(i,j,0);
                    // 	scene.add( cube );	
                    // 	}
                    // } <--- three.js code tht doesn't really work that well lmao
                var r = Math.ceil(Math.random()*4);
                var geometry = new THREE.BoxGeometry( 1, r,1);
                var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                var cube = new THREE.Mesh( geometry, material );
                cube.position.set(i,-65+r/2,0); //-65 is the bottom of z (?)
                this.gameManager.scene.add( cube );	
            }
        }
    }
    update = (dt:number, time:number, paused:boolean) => {
	}

	play = (time: number) => {
	}

	togglePause = (paused:boolean, resumeTime:number) => {
	}

	changeSpeed = (speed:number):void => { //play, togglePause, changeSpeed needed b/c of interface, no functionality
	}
}
export = TerrainSubsystem;