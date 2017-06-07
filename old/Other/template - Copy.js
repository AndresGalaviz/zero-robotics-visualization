console.log("hi");

var sphereMeshAnimation; //Object added for year specific, fix

//This function is called when the web page is first loaded
function initTemplate(){
	//Get the JSON Data we need from the window variables
  var JSONData = window.simData; //Unecessary, done in other Javascript
  JSONObj = JSON.parse(JSONData);
  addItemToAnim();

}

//This function is called every animaiton frame
function animateTemplate(){
	if (sphereMeshAnimation){
 		updateRelatedData();
  		addStats();
  	}
}

//Tells where in the results.JSON different variables are stored
function getDataLoc(dataType){
	if(dataType == 'fuel')
    	return ["dF", 1];
  	if (dataType == 'score')
    	return ["dF", 0];
}

//Updates data displayed on the page
function updateRelatedData(){
  var time = parseInt(sphereMeshAnimation.currentTime);
  if( time<JSONObj.satData[0]["dF"][1].length){
    var fuelLoc = getDataLoc('fuel');
    document.getElementById("fuelBlue").value = JSONObj.satData[0][fuelLoc[0]][fuelLoc[1]][time];
    document.getElementById("fuelRed").value = JSONObj.satData[1][fuelLoc[0]][fuelLoc[1]][time];
    }
}

//Adds stats to the context html item
function addStats(){ //testing multiple items
	// get the canvas element using the DOM
	var canvas = document.getElementById('stats');
	if (canvas.getContext){

    // use getContext to use the canvas for drawing
		var ctx = canvas.getContext('2d');
    ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
		// Filled triangle
		ctx.font = "16px serif";
    if (sphereAnimate)
      ctx.fillText("Position: " + sphereAnimate.position.x + ", "+ sphereAnimate.position.y, 10, 50);
    else
      ctx.fillText("Wait for it", 10, 50);
	}
  else {
  	alert('You need Safari or Firefox 1.5+ to see this demo.');
	}
} 

//Adds item to the animation
function addItemToAnim(){

  //The following is an example of an item being added to the visualization
  //NOTE:  See createAnimData in the other JS file for how to pull data
  //       from results.json into the correct format for an animation.
  var geometry = new THREE.SphereGeometry( 11, 11, 11 );
  var violetMaterial = new THREE.MeshBasicMaterial( { color: 0x6259CA , transparent: true, opacity: 0.5 } );
  sphereAnimate = new THREE.Mesh( geometry, violetMaterial);
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
            "pos" :[0.0,20.0,35.0]
          },
          {
            "time":20.0,
            "pos" :[0.0,0.0,0.0]
          }
        ]
      }
    ]
    };
    //ensureLoop( animationData ); //Don't need to ensure loop
    sphereMeshAnimation = new THREE.Animation( sphereAnimate, animationData );
    sphereMeshAnimation.loop = false;
    sphereMeshAnimation.play();
    scene.add(sphereAnimate);
}


//Use the following methods for items other than the main spheres
//The main spheres are handled in the other file

//Pauses the animation
function pauseAnimationItems(){
    sphereMeshAnimation.stop();

}

//Speed up or slow down items in the animation (other than the spheres)
function changeSpeedItems(speed){ 
    sphereMeshAnimation.timeScale = speed;
}

//Plays the animation from the given start time
function playAnimationItems(time){
  sphereMeshAnimation.play(time);
}