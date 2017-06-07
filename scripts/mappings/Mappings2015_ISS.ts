import Mappings2015 = require("./Mappings2015");
import ResultObject2015 = Mappings2015.ResultObject2015;
import ItemType2015 = Mappings2015.ItemType2015;

export class ResultObject2015_ISS extends ResultObject2015 {
  
  getItemData = ():{pos: number[], type: ItemType2015}[] => {    
    var res = [
      {type: ItemType2015.Energy, pos: [0.233050,0.019590,0.194300]},
      {type: ItemType2015.Energy, pos: [-0.233050,0.019590,0.194300]},
      {type: ItemType2015.Energy, pos: [0.000000,0.080970,0.173450]},
      {type: ItemType2015.Score, pos: [0.193175,0.499760,0.481900]},
      {type: ItemType2015.Score, pos: [-0.193175,0.499760,0.481900]},
      {type: ItemType2015.Score, pos: [0.221825,0.588340,-0.306300]},
      {type: ItemType2015.Score, pos: [-0.221825,0.588340,-0.306300]},
      {type: ItemType2015.Mirror, pos: [0.450180,0.074820,-0.375480]},
      {type: ItemType2015.Mirror, pos: [-0.450180,0.074820,-0.375480]},
    ];    
    return res;
  }

  getLightConfig = () => {
    return {
      center: -0.2,
      direction: 1, // plus or minus one
    }
  }
  
  
    getGameType = (): Mappings2015.GameType => {
      return Mappings2015.GameType.Alliance;
    }

}
