module Constants {
  export var gameSpaceDims = [1.28, 1.6, 1.28];
  export var scalingFactor = 100;
  export var visSpaceDims = [
    gameSpaceDims[0] * scalingFactor,
    gameSpaceDims[2] * scalingFactor,
    gameSpaceDims[1] * scalingFactor
  ];

  export module Y2015 {
    export module MovingLight {
	  export var greyZoneWidth = 0.06 * scalingFactor;
	}

    export module SwitchingLight {
      export var greyZoneWidth = 0.12 * scalingFactor;
	  export var lightCenter = [0, 0, 0];
	}
  }

  export module Y2016HS {
  	export var zoneRadius = 0.11 * scalingFactor; 
  }

  export module Y2017HS {
    export var baseRadius = .15 * scalingFactor;
    export var analyzerRadius = .11 * scalingFactor;
  }

  export var UP = new THREE.Vector3(0, 1, 0);

}

export = Constants;
