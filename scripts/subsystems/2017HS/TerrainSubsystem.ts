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
        this.resObject = (<ResultObject2017HS> this.gameManager.resObject); //Uses 2016 Result Object
        var grid = this.resObject.getTerrainArray(0); //136x170 (?)  array with the terrain heights ranging from 1-4 Need to look into array indexing things
        for(var i = 0;i<136;i+=8.5){
            for(var j = 0;j<170;j+=8.5){
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
                var height = grid[i][j];
                var geometry = new THREE.BoxGeometry( 8.5, height*8.5,8.5); //width, height, depth 
                if(height==1)
                    var material = new THREE.MeshBasicMaterial( {color: 0xa7dff9} );
                else if(height==2)
                    var material = new THREE.MeshBasicMaterial( {color: 0x14a030} );
                else if(height==3)
                    var material = new THREE.MeshBasicMaterial( {color: 0xd8d524} );    
                else
                    var material = new THREE.MeshBasicMaterial( {color: 0xd3393b} );
                
                var cube = new THREE.Mesh( geometry, material );
                cube.position.set(i-64,-65+height*8.5/2,j-80); //position.set(i,j,k) corresponds to x,z,y
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