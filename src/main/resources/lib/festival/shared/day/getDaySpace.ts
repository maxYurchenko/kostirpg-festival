import { getLocations } from "../location/getLocations";
import { getGameBlocks } from "../block/getGameBlocks";

export { getDaySpace };

function getDaySpace(dayId: string): DaySpace {
  let dayLocations = getLocations(dayId);
  let space = {
    total: 0,
    reserved: 0
  };
  for (let i = 0; i < dayLocations.length; i++) {
    let blocks = getGameBlocks(dayLocations[i]._id);
    for (let j = 0; j < blocks.length; j++) {
      let block = blocks[j];
      if (!block?.processed?.space) continue;
      space = {
        total: space.total + block.processed.space.total,
        reserved: space.reserved + block.processed.space.reserved
      };
    }
  }
  return {
    total: space.total,
    reserved: space.reserved
  };
}

export interface DaySpace {
  total: number;
  reserved: number;
}
