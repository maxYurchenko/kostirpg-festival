import { Game } from "../../site/content-types/game/game";

const contentLib = __non_webpack_require__("/lib/xp/content");

export { gameSpaceAvailable };

function gameSpaceAvailable(id: string): boolean {
  let game = contentLib.get<Game>({ key: id });
  if (!game) return false;
  let players = utils.data.forceArray(game.data.players);
  if (parseInt(game.data.maxPlayers) > players.length) {
    return true;
  }
  return false;
}
