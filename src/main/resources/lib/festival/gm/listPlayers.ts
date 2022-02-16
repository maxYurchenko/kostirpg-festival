const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");
const userLib = __non_webpack_require__("/lib/userLib");
const cacheLib = require("../helpers/cache");
const cartLib = require("/lib/cartLib");

import { Game } from "../../../site/content-types/game/game";
import { Content } from "enonic-types/content";
import { User } from "../../../types/user";
import { Valid } from "../../../types/validation";

export { listPlayers };

function listPlayers(gameId?: string): Valid {
  if (!gameId) return { error: true, message: "Выберите игру." };

  let game = contentLib.get<Game>({ key: gameId });
  if (!game) return { error: true, message: "Игра не найдена." };

  if (!game.data.players) return { error: false, data: [] };
  game.data.players = utils.data.forceArray(game.data.players);
  if (!game.data.players) return { error: false, data: [] };

  let players: Player[] = [];
  game.data.players.forEach((player) => {
    let playerData = contentLib.get<User>({ key: player });

    let discord = null;
    if (playerData && playerData.data && playerData.data.discord) {
      discord = userLib.getDiscordData(playerData._id);
    }
    let ticket: Ticket | null = null;

    if (playerData?.data.kosticonnect2022) {
      const cart = cartLib.getCartByQr(playerData.data.kosticonnect2022);
      ticket = {
        turbo: cart.legendary
      };
    }

    if (playerData)
      players.push({
        displayName: playerData.displayName,
        email: playerData.data.email,
        phone: playerData.data.phone,
        discord: discord,
        ticket: ticket,
        _id: playerData._id
      });
  });
  return { error: false, data: players };
}

interface Player {
  _id: string;
  displayName: string;
  email: string;
  phone?: string;
  discord?: string;
  ticket: Ticket | null;
}

interface Ticket {
  turbo: boolean;
}
