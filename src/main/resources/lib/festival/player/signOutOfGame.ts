const contentLib = __non_webpack_require__("/lib/xp/content");
const userLib = __non_webpack_require__("/lib/userLib");
const utils = __non_webpack_require__("/lib/util");

import { Game } from "../../../site/content-types/game/game";
import { UserAllData } from "../../../types/kostiUser";
import { updateEntity } from "../shared/updateEntity";
import { Valid } from "../../../types/validation";

export { signOutOfGame };

function signOutOfGame(gameId: string): Valid {
  if (!gameId) {
    return { error: true };
  }
  let user: UserAllData = userLib.getCurrentUser();
  let game = contentLib.get<Game>({ key: gameId });
  if (!game) return { error: true };
  let players: string[] = game.data.players
    ? utils.data.forceArray(game.data.players)
    : [];
  let index = players.indexOf(user.content._id);
  if (index > -1) {
    players.splice(index, 1);
    game.data.players = players;
    game.data.spaceAvailable = players.length < parseInt(game.data.maxPlayers);
    updateEntity(game);
  }
  return { error: false };
}
