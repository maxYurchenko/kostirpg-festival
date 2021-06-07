const contentLib = __non_webpack_require__("/lib/xp/content");

import { Game } from "../../site/content-types/game/game";
import { updateEntity } from "../shared/updateEntity";

export { signOutOfGame };

function signOutOfGame(gameId: string): Valid {
  if (!gameId) {
    return { error: true };
  }
  let user = userLib.getCurrentUser();
  let game = contentLib.get<Game>({ key: gameId });
  if (!game) return { error: true };
  let players: string[] = game.data.players
    ? utils.data.forceArray(game.data.players)
    : [];
  let index = players.indexOf(user._id);
  if (index > -1) {
    players.splice(index, 1);
    game.data.players = players;
    updateEntity(game);
  }
  return { error: false };
}
