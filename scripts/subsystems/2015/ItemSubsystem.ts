/// <reference path="../../CommonImports"/>

import Subsystem = require("../../Subsystem");
import GameManager = require("../../GameManager");
import Helpers = require("../../Helpers");

import Mappings2015 = require("../../mappings/Mappings2015");
import ItemType2015 = Mappings2015.ItemType2015;
import ResultObject2015 = Mappings2015.ResultObject2015;

class ItemSubsystem implements Subsystem {
  private itemMeshes: THREE.Mesh[] = [];
  private sphereZeroItemTimes: number[][];
  private sphereOneItemTimes: number[][];
  private itemData: {pos: number[], type: Mappings2015.ItemType2015}[];

  private mpEmpty = 0x0fff;

  private gameManager : GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  init = () => {
    var result = (<ResultObject2015> this.gameManager.resObject);
    this.sphereZeroItemTimes = result.getItemPickupTimes(0);
    this.sphereOneItemTimes = result.getItemPickupTimes(1);
    this.itemData = result.getItemData();
    this.setupItems();
  }

  update = (dt:number, time:number, paused:boolean) => {
    var time = this.gameManager.resObject.getShortIndexByTime(time);
    for (var i = 0; i < this.itemData.length; i++) {
      var pickedUp = this.sphereZeroItemTimes[i][time] != this.mpEmpty ||
                     this.sphereOneItemTimes[i][time] != this.mpEmpty;

      this.itemMeshes[i].visible = !pickedUp;
    }
  }

  play = (time: number) => {
  }

  togglePause = (paused:boolean, resumeTime:number) => {
  }

  changeSpeed = (speed:number):void => {
  }

  setupItems = ():void  => {
    for (var i = 0; i < this.itemData.length; i++) {
      var item = this.itemData[i];

      var geometry = new THREE.BoxGeometry( 7, 7, 7 );

      var color;
      switch (item.type) {
        case Mappings2015.ItemType2015.Score:
          color = 0xffff00;
          break;
        case Mappings2015.ItemType2015.Mirror:
          color = 0x00ffff;
          break;
        case Mappings2015.ItemType2015.Energy:
          color = 0xff00ff;
          break;
        default:
          throw "Shouldn't get here"
      }
      var material = new THREE.MeshBasicMaterial( { color: color } );
      var mesh = new THREE.Mesh( geometry, material );

      this.itemMeshes[i] = mesh;
      mesh.position.fromArray(Helpers.convertCoords(item.pos));
      this.gameManager.scene.add(mesh);
    }
  }
}

export = ItemSubsystem;
