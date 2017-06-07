var scene, WIDTH, HEIGHT, renderer, camera, controls, scene, sphere1, sphere2, sphereAnimate, geometry;
init();

var clock;
var stats, pauseTime;
var sphereZeroMesh, sphereOneMesh;

function init(){
  console.log("1");
	//Get the JSON Data we need from the window variables
  var JSONData = window.simData;
  JSONObj = JSON.parse(JSONData);
  //console.log(JSONObj.satData[0]["dF"][2]);

	//Width and height of the scene - should be dynamic
	WIDTH = 700;
	HEIGHT = 450;

  clock = new THREE.Clock();
	//Create the renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);
  renderer.setClearColor(0x353535, 1.0);
  renderer.clear();

  // new THREE.PerspectiveCamera( FOV, viewAspectRatio, zNear, zFar );
	camera = new THREE.PerspectiveCamera(45, (WIDTH)/(HEIGHT), 0.1, 10000);
	camera.position.z = 100;
	camera.position.x = 100;
	camera.position.y = 100;
	//Mouse orbit control
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.damping = 0.2;
	controls.addEventListener( 'change', render );

	//Set up basics
	scene = new THREE.Scene();
  //updateSpheres();
  initTemplate();
	drawAxes();
	simulateSpheres();
  animate();
  
};

function drawAxes(){
	//Make axes lines
	var axesEndPointX = 64;
  var axesEndPointY = 80;
  var axesEndPointZ = 64;
	drawLine(0xff0000, -axesEndPointY,0,0,axesEndPointY,0,0)
	drawLine(0xff0000, 0,-axesEndPointX,0,0,axesEndPointX,0)
	drawLine(0xff0000, 0,0,-axesEndPointZ,0,0,axesEndPointZ)

	var crossSeperation = 10;
	var crossLength = 1;
	var crossNumber = 12;
	//Drawing crosses
	//Dimension iteration
	for (i = 1; i <= 3; i++) { 
		//Axes iteration
		for (j = -crossNumber/2; j <= crossNumber/2; j++){
			//console.log(i);
			var crossGeometry = new THREE.Geometry();
			//X
			if (i == 1){
				drawLine(0xff0000, j * crossSeperation, 0, -crossLength, j * crossSeperation, 0, crossLength);
				drawLine(0xff0000, j * crossSeperation, -crossLength, 0, j * crossSeperation, crossLength, 0);
			}
			//Y
			if (i==2){
				drawLine(0xff0000, 0, j * crossSeperation, -crossLength, 0, j * crossSeperation, crossLength);
				drawLine(0xff0000, -crossLength, j * crossSeperation, 0, crossLength, j * crossSeperation, 0);
			}
			//Z
			if (i==3){
				drawLine(0xff0000, 0, -crossLength, j * crossSeperation, 0, crossLength, j * crossSeperation);
				drawLine(0xff0000, -crossLength, 0, j * crossSeperation, crossLength, 0, j * crossSeperation);
			}
		}
	}
	
}
	
function drawLine(color,x1,y1,z1,x2,y2,z2){
	var material = new THREE.LineBasicMaterial({
	color: color
	});

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( x1, y1, z1 ),
		new THREE.Vector3( x2, y2, z2 )
	);
	var line = new THREE.Line( geometry, material );
	scene.add( line );
}



function simulateSpheres(){
	//TODO:  Adjust spheres to real relative size
	//TODO:  Start spheres in correct locations
	var geometry = new THREE.SphereGeometry( 11, 11, 11 );
	var blueMaterial = new THREE.MeshBasicMaterial( { color: 0x1659CB , transparent: true, opacity: 0.5 } );
	var redMaterial = new THREE.MeshBasicMaterial( { color: 0xe3958b, transparent: true, opacity: 0.5 } );
	sphere1 = new THREE.Mesh( geometry.clone(), blueMaterial );
	sphere2 = new THREE.Mesh( geometry.clone(), redMaterial );
	sphere1.position.x = -20;
	sphere2.position.x = 20;

  console.log("boo");
  console.log(createAnimData(0));
  var s0Data = JSON.parse(createAnimData(0));
	var s1Data = JSON.parse(createAnimData(1));
  sphereZeroMesh = new THREE.Animation( sphere1, s0Data);
  sphereZeroMesh.loop = false;
  sphereZeroMesh.play();

  sphereOneMesh = new THREE.Animation( sphere2, s1Data);
  sphereOneMesh.loop = false;
  sphereOneMesh.play();

  scene.add(sphere1);
	scene.add(sphere2);


}


//NOT NEEDED: If an animation is looped, makes sure the loop is smooth (start pos = end pos)
function ensureLoop( animation ) {

  for ( var i = 0; i < animation.hierarchy.length; i ++ ) {

    var obj = animation.hierarchy[ i ];

    var first = obj.keys[ 0 ];
    var last = obj.keys[ obj.keys.length - 1 ];

    last.pos = first.pos;
    last.rot = first.rot;
    last.scl = first.scl;

  }

}

//Sets Up the next animation frame and updates the other related items 
function animate(t) {
  camera.lookAt(scene.position);
  // renderer automatically clears unless autoClear = false
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  THREE.AnimationHandler.update( delta );
  
  animateTemplate();
  render();
}

//Renders the animation
function render(){
   renderer.render(scene,camera);
 }

//Pauses the animation
function pauseAnimation(){
  if(sphereZeroMesh.isPlaying){
    sphereZeroMesh.stop();
    sphereOneMesh.stop();
    pauseAnimationItems();  //Year specific, see template.js
    pauseTime = sphereZeroMesh.currentTime;
  }
  else{
    sphereZeroMesh.play(pauseTime);
    sphereOneMesh.play(pauseTime);
    playAnimationItems(pauseTime);  //Year specific, see template.js
  }

}

//Speed up or slow down the animation 
function changeSpeed(speed){ 
  sphereZeroMesh.timeScale = speed;
  sphereOneMesh.timeScale = speed;
  changeSpeedItems(speed);  //Year specific, see template.js
  animationSpeed = speed;
}

//Plays the animation from the given start time
function play(time){
  sphereZeroMesh.play(time);
  sphereOneMesh.play(time);
  playAnimationItems(time);  //Year specific, see template.js
  animationTime = time;
}


//TODO:  Parse results.json into usable animation data
function createAnimData(satNumber){
  var animationData = {
    "name"      : "Action",
    "fps"       : 25,
    "length"    : 20.0,
    "hierarchy" : [
      {
        "parent" : -1, //root
        "keys"   : [
          {
            "time":0,
            "pos" :[0.0,0.0,0.0],
            "rot" :[0,0,0,0],
            "scl" :[1,1,1]
          },
          {
            "time":10.0,
            "pos" :[0.0,50.0,50.0]
          },
          {
            "time":20.0,
            "pos" :[0.0,0.0,0.0]
          }
        ]
      }
    ]
    };
    
  var animDataTest =     '{"name"      : "Action","fps"       : 25, "length"    : 20.0, "hierarchy" : [{"parent" : -1, "keys"   : [';
  for (var i=0; i < JSONObj.tDbg.length; i++){
      
      var satTime = JSONObj.tDbg[i];
      var timeTxt = '"time":' + satTime + ",";
      
      //Position needs to be scaled up by 100
      var posTxt ='"pos" :['
      posTxt += 100*JSONObj.satData[satNumber]['st'][0][satTime] + ",";
      posTxt += 100*JSONObj.satData[satNumber]['st'][1][satTime] + ",";
      posTxt += 100*JSONObj.satData[satNumber]['st'][2][satTime] ;
      posTxt += '],';

      var rotTxt ='"rot" :['
      rotTxt += JSONObj.satData[satNumber]['st'][6][satTime] + ",";
      rotTxt += JSONObj.satData[satNumber]['st'][7][satTime] + ",";
      rotTxt += JSONObj.satData[satNumber]['st'][8][satTime] + ",";
      rotTxt += JSONObj.satData[satNumber]['st'][9][satTime];
      rotTxt += '],';

      animDataTest = animDataTest + '{'+ timeTxt;
      animDataTest = animDataTest + posTxt;
      animDataTest = animDataTest + rotTxt;
      animDataTest = animDataTest + '"scl" :[1,1,1]'
      animDataTest = animDataTest + '}';
      if (i<JSONObj.tDbg.length-1)
        animDataTest += ',';
  }
  animDataTest +='] }] }'
  console.log(animDataTest);
  return animDataTest;


}

