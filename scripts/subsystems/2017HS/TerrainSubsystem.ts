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
        if(this.resObject.getGameType()==Mappings2017HS.GameType.ZR3D){
            var grid = this.resObject.getTerrainArray(0); //16x20  array with the terrain heights ranging from 1-4 
            for(var i = 0;i<160;i+=8){ //8 cm is because of scaling from game code to visualiztion,
                for(var j = 0;j<128;j+=8){
                    var height = grid[i/8][j/8];
                    var geometry = new THREE.BoxGeometry( 8, height*8,8); //width, height, depth 
                    if(height==1)
                        var material = new THREE.MeshBasicMaterial( {color: 0x023A6D} );
                    else if(height==2)
                        var material = new THREE.MeshBasicMaterial( {color: 0x326898} );
                    else if(height==3)
                        var material = new THREE.MeshBasicMaterial( {color: 0x7A94DE} );   
                    else
                        var material = new THREE.MeshBasicMaterial( {color: 0xDFE6FA} );
                    var cube = new THREE.Mesh( geometry, material );
                    cube.position.set(j-60,-65+height*8/2,i-76); //position.set(i,j,k) corresponds to x,z,y
                    this.gameManager.scene.add( cube );	
                }   
            }
        }
        else{
            var grid = this.resObject.getTerrainArray(0); //this will be in the same format as above except it will have concentrations not heights 
            for(var i = 0;i<160;i+=8){
                for(var j = 0;j<128;j+=8){
                    var geometry = new THREE.BoxGeometry(8,1,8);
                    var conc = grid[i/8][j/8];
                    if (conc==10)
                        var material = new THREE.MeshBasicMaterial( {color: 0xa30928} );
                    else if(conc ==6)
                        var material = new THREE.MeshBasicMaterial( {color: 0x730ac9} );
                    else if(conc ==3)
                        var material = new THREE.MeshBasicMaterial( {color: 0x61a2ed} );
                    else
                        var material = new THREE.MeshBasicMaterial( {transparent:true,opacity: 0.1 } );
                    var square = new THREE.Mesh(geometry,material);
                    square.position.set(j-60,-15,i-76); 
                    this.gameManager.scene.add(square);                   
                }
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