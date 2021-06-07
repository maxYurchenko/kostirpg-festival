import { Block } from "../../../site/content-types/block/block";
import { Game } from "../../../site/content-types/game/game";

const contentLib = __non_webpack_require__("/lib/xp/content");
const common = __non_webpack_require__("/lib/xp/common");

export { checkIfGameExists };

function checkIfGameExists(displayName: string, data: Game): boolean {
  var gameBlock = contentLib.get<Block>({ key: data.block });
  if (!gameBlock) return false;
  var games = contentLib.query({
    query:
      "data.location = '" +
      data.location +
      "' and _parentPath = '/content" +
      gameBlock._path +
      "' and _name = '" +
      common.sanitize(displayName) +
      "'",
    start: 0,
    count: 0
  });
  if (games.total > 0) {
    return true;
  }
  return false;
}
