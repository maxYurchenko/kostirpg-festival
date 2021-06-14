const userLib = __non_webpack_require__("/lib/userLib");

import { getItemsList } from "../../shared/getItemsList";
import { beautifyGame, isGame } from "../game/beautifyGame";

export { getDaysByUser };

function getDaysByUser(parent: string, admin?: boolean) {
  var user = userLib.getCurrentUser();
  let games;
  let result = [];
  if (admin) {
    games = getItemsList({
      parentId: parent,
      parentPathLike: true,
      type: "game",
      sort: "_parentPath ASC"
    });
  } else {
    games = getItemsList({
      master: user._id,
      parentId: parent,
      parentPathLike: true,
      type: "game"
    });
  }
  for (var i = 0; i < games.length; i++) {
    let game = games[i];
    if (!isGame(game)) continue;
    result.push(beautifyGame(game));
  }
  return result;
}
