const contentLib = __non_webpack_require__("/lib/xp/content");

import { gameSpaceAvailable } from "../shared/gameSpace";
import { updateEntity } from "../shared/updateEntity";
import { validateUser } from "../player/validateUser";
import { Game } from "../../site/content-types/game/game";
import { UserAllData } from "../../types/kostiUser";

export { signForGame };

function signForGame(gameId: string): Valid {
  if (!gameId || !gameSpaceAvailable(gameId)) {
    return { error: true, message: "Мест больше нет." };
  }
  let user: UserAllData = userLib.getCurrentUser();
  let game = contentLib.get<Game>({ key: gameId });
  if (!game) return { error: true };
  let userValid = validateUser(game);
  if (userValid.error) {
    return userValid;
  }
  let players: string[] = game.data.players
    ? utils.data.forceArray(game.data.players)
    : [];
  if (players.indexOf(user.content._id) === -1) {
    players.push(user.content._id);
    game.data.players = players;
    updateEntity(game);
  }
  return { error: false };
}
