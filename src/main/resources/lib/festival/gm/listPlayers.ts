const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");

import { Game } from "../../../site/content-types/game/game";
import { Content } from "enonic-types/content";
import { User } from "../../../types/user";
import { Valid } from "../../../types/validation";

export { listPlayers };

function listPlayers(gameId?: string): Content<User>[] | Valid {
  if (!gameId) return { error: true, message: "Выберите игру." };

  let game = contentLib.get<Game>({ key: gameId });
  if (!game) return { error: true, message: "Игра не найдена." };

  if (!game.data.players) return [];
  game.data.players = utils.data.forceArray(game.data.players);
  if (!game.data.players) return [];

  let players: Content<User>[] = [];
  game.data.players.forEach((player) => {
    let playerData = contentLib.get<User>({ key: player });
    if (playerData) players.push(playerData);
  });
  return players;
}
