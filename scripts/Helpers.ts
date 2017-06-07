/// <reference path="../typings/threejs/three.d.ts"/>

import Constants = require("./Constants");
import GameManager = require("./GameManager");

export function lerpColors(p: number, color1: number, color2: number) {
  return 0x10000 * (Math.round(Math.floor(color1 / 0x10000) * (1-p) + Math.floor(color2 / 0x10000) * p)) +
    0x100 * (Math.round((Math.floor(color1 / 0x100) % 0x100) * (1-p) + (Math.floor(color2 / 0x100) % 0x100) * p)) +
    Math.round((color1 % 0x10000) * (1-p) + (color2 % 0x10000) * p)
}

export function oscillateColors(p: number, color1: number, color2: number) {
  p *= 2;
  if (p < 1) {
    return lerpColors(p, color1, color2);
  }
  return lerpColors(2-p, color2, color1);
}

export function constructLine(color : number, x1:number, y1:number, z1:number,
  x2: number, y2: number, z2: number) : THREE.Line {

  var material = new THREE.LineBasicMaterial({
    color: color
  });

  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( x1, y1, z1 ),
    new THREE.Vector3( x2, y2, z2 )
  );
  var line = new THREE.Line( geometry, material );

  return line;
}

export function outOfBounds(coords: number[]): boolean {
  var [x, y, z] = coords;
  return !(x < Constants.visSpaceDims[0]/2 && x > -Constants.visSpaceDims[0]/2
    && y < Constants.visSpaceDims[1]/2 && y > -Constants.visSpaceDims[1]/2
    && z < Constants.visSpaceDims[2]/2 && z > -Constants.visSpaceDims[2]/2)
}

export function convertCoords(arr: number[]) : number[] {
  var sf = Constants.scalingFactor;

  return [sf * arr[0], -sf * arr[2], sf * arr[1]];
}

export function unconvertCoords(arr: number[]) : number[] {
  var sf = 1/Constants.scalingFactor;

  return [sf * arr[0], sf * arr[2], -sf * arr[1]];
}

export function convertQuat(quat: THREE.Quaternion) : THREE.Quaternion {
    var angle = Math.acos(quat.w) * 2;
    var vecC = Math.sin(angle / 2);
    var vec = [quat.x / vecC, quat.y / vecC, quat.z / vecC];
    var newVec = [vec[0], -vec[2], vec[1]]; // like convertCoords but without scaling

    // now we reflect along the z axis. To do this we create a quaternion that rotates 180
    // degrees around the x axis, and multiply the rotation quaternion by it
    var temp = new THREE.Quaternion(newVec[0] * vecC, newVec[1] * vecC, newVec[2] * vecC, quat.w);
    var flipZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3().fromArray([1, 0, 0]), Math.PI);
    return temp.multiply(flipZ);
}

export function constructCone(angle: number, height: number)
  : THREE.Geometry {

  var radius = height * Math.tan(angle);


  var geom = new THREE.CylinderGeometry(radius, 0, height, 20);

  geom.applyMatrix( new THREE.Matrix4().makeTranslation(0, height/2, 0));
  geom.applyMatrix( new THREE.Matrix4().makeRotationZ(Math.PI/2));
  // geom.applyMatrix( new THREE.Matrix4().makeRotationZ(Math.PI/2));
  geom.verticesNeedUpdate = true;

  return geom;
}


export function setupSkybox(gm:GameManager): THREE.Mesh {
  var p = gm.resourcePath;
  var materialURLs = [
    p+'skybox_right.png',
    p+'skybox_left.png',
    p+'skybox_up.png',
    p+'skybox_down.png',
    p+'skybox_back.png',
    p+'skybox_front.png'
  ];

  var materials = materialURLs.map((url: string, i: number) => {
    var texture = THREE.ImageUtils.loadTexture(url);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    if (i == 2 || i == 3) {
      texture.repeat.y = -1;
    } else {
      texture.repeat.x = -1;
    }
    return new THREE.MeshBasicMaterial({
         map: texture,
         side: THREE.DoubleSide,
         depthWrite: false,
     });
  });

  var box = new THREE.Mesh(new THREE.BoxGeometry(10,10,10), new THREE.MeshFaceMaterial(materials));
  return box;
}

export function setupBasicSkybox(gm:GameManager): THREE.Mesh {
  var t = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
       side: THREE.DoubleSide,
       depthWrite: false,
   });

   var box = new THREE.Mesh(new THREE.BoxGeometry(10,10,10), t);
   return box;
}

export function escapeHTML(text:string): string {
  return $('<div/>').text(text).html();
}
