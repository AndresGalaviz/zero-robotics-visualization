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
        this.resObject = (<ResultObject2017HS> this.gameManager.resObject); 
        var grid = this.resObject.getTerrainArray(0); //16x20  array with the terrain heights ranging from 1-4 
        for(var i = 0;i<170;i+=8.5){ //8.5 is because of scaling from game code to visualiztion, value might be incorrect though
            for(var j = 0;j<136;j+=8.5){
                var height = grid[i/8.5][j/8.5];
                var geometry = new THREE.BoxGeometry( 8.5, height*8.5,8.5); //width, height, depth 
                if(height==1)
                     var material = new THREE.MeshBasicMaterial( {color: 0x023A6D} );
                else if(height==2)
                    var material = new THREE.MeshBasicMaterial( {color: 0x326898} );
                else if(height==3)
                    var material = new THREE.MeshBasicMaterial( {color: 0x7A94DE} );   
                else
                    var material = new THREE.MeshBasicMaterial( {color: 0xDFE6FA} );
                var cube = new THREE.Mesh( geometry, material );
                cube.position.set(j-64,-65+height*8.5/2,i-80); //position.set(i,j,k) corresponds to x,z,y
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