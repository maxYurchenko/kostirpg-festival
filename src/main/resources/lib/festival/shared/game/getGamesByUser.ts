const userLib = __non_webpack_require__("/lib/userLib");
const utils = __non_webpack_require__("/lib/util");

import { UserAllData } from "../../../../types/kostiUser";
import { getItemsList } from "../getItemsList";
import { beautifyGame, isGame } from "./beautifyGame";

export { getGamesByUser };

function getGamesByUser(
  parent?: string,
  admin?: boolean,
  skipBeautify?: boolean
) {
  var user: UserAllData = userLib.getCurrentUser();
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
      master: user.content._id,
      parentId: parent,
      parentPathLike: true,
      type: "game"
    });
  }
  for (var i = 0; i < games.length; i++) {
    let game = games[i];
    if (!isGame(game)) continue;
    if (skipBeautify) result.push(game);
    else result.push(beautifyGame(game));
  }
  return result;
}
