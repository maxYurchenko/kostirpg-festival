import { Block } from "../../site/content-types/block/block";
import { Location } from "../../site/content-types/location/location";

const contentLib = __non_webpack_require__("/lib/xp/content");

export { getLocationSpace };

function getLocationSpace(locationId: string, blockId: string): LocationSpace {
  var location = contentLib.get<Location>({ key: locationId });
  var gameBlock = contentLib.get<Block>({ key: blockId });
  if (!gameBlock || !location) {
    return {
      total: 0,
      reserved: 0,
      available: 0
    };
  }
  var games = contentLib.query({
    query:
      "data.location = '" +
      locationId +
      "' and _parentPath = '/content" +
      gameBlock._path +
      "'",
    start: 0,
    count: 0
  });
  return {
    total: location.data.maxGames,
    reserved: games.total,
    available: location.data.maxGames - games.total
  };
}

interface LocationSpace {
  total: number;
  reserved: number;
  available: number;
}
