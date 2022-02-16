const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");

import { Game } from "../../../site/content-types/game/game";
import { updateEntity } from "../shared/updateEntity";

export { deletePlayer };

function deletePlayer(gameId?: string, userId?: string) {
  if (!gameId) return { error: true, message: "Выберите игру." };
  if (!userId) return { error: true, message: "Выберите игрока." };

  const game = contentLib.get<Game>({ key: gameId });
  if (!game) return { error: true, message: "Игра не найдена." };

  const players: string[] = game.data.players
    ? utils.data.forceArray(game.data.players)
    : [];
  const index = players.indexOf(userId);
  if (index > -1) {
    players.splice(index, 1);
    game.data.players = players;
    game.data.spaceAvailable = players.length < parseInt(game.data.maxPlayers);
    updateEntity(game);
  }
  return { error: false };
}
