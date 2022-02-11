const userLib = __non_webpack_require__("/lib/userLib");
const utils = __non_webpack_require__("/lib/util");

import { UserAllData } from "../../../../types/kostiUser";
import { getItemsList } from "../getItemsList";
import { beautifyGame, isGame } from "./beautifyGame";

export { getGamesByPlayer };

function getGamesByPlayer(parent: string, admin?: boolean) {
  var user: UserAllData = userLib.getCurrentUser();
  let games;
  let result = [];
  games = getItemsList({
    parentId: parent,
    parentPathLike: true,
    type: "game",
    additionalQuery:
      " and (data.players = '" +
      user.content._id +
      "' OR data.master = '" +
      user.content._id +
      "')",
    sort: "data.datetime ASC"
  });
  for (var i = 0; i < games.length; i++) {
    let game = games[i];
    if (!isGame(game)) continue;
    result.push(beautifyGame(game));
  }
  return result;
}
