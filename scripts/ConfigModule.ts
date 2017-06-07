import Results = require("./Results");
import ResultObject = Results.ResultObject;
import SimData = Results.SimData;
import IExtendedResultObject = Results.IExtendedResultObject;

import Mappings2015 = require("./mappings/Mappings2015");
import ResultObject2015 = Mappings2015.ResultObject2015;

import Mappings2016MS = require("./mappings/Mappings2016MS");
import ResultObject2016MS = Mappings2016MS.ResultObject2016MS;
import Mappings2015_ISS = require("./mappings/Mappings2015_ISS");
import ResultObject2015_ISS = Mappings2015_ISS.ResultObject2015_ISS;

import Mappings2016HS = require("./mappings/Mappings2016HS");
import ResultObject2016HS = Mappings2016HS.ResultObject2016HS;
import Mappings2016HS_ISS = require("./mappings/Mappings2016HS_ISS");
import ResultObject2016HS_ISS = Mappings2016HS_ISS.ResultObject2016HS_ISS;

import MappingsFreeMode = require("./mappings/MappingsFreeMode");
import ResultObjectFreeMode = MappingsFreeMode.ResultObjectFreeMode;

module ConfigModule {
  export interface Type {
      GameVersion: string,
      CamStartingPosition: number[],
  }

  export var Config: Type = {
    GameVersion: "Freemode",
    CamStartingPosition: [0, -2.5, -1],
  }

  export function Set(c: Type) {
    for (var setting in c) {
      if (c.hasOwnProperty(setting)) {
        Config[setting] = c[setting];
      }
    }
  }

  export function GetResultObject(data: SimData): IExtendedResultObject {
    switch(Config.GameVersion) {
      case "SpaceSPHERES": return new ResultObject2016HS(data);
      case "SpaceSPHERES_ISS": return new ResultObject2016HS_ISS(data);
      case "SpySPHERES": return new ResultObject2015(data);
      case "SpySPHERES_ISS": return new ResultObject2015_ISS(data);
      case "SpySPHERES_MS": return new ResultObject2016MS(data);
      default: return new ResultObjectFreeMode(data);
    }
  }
}

export = ConfigModule
