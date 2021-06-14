import { Game } from "../../../site/content-types/game/game";

const cartLib = require("/lib/cartLib");
const contentLib = __non_webpack_require__("/lib/xp/content");

export { validateTicketGameAllowed };

function validateTicketGameAllowed(ticketId: number, gameId: string): boolean {
  let game = contentLib.get<Game>({ key: gameId });
  if (!game) return false;
  if (!game.data.exclusive) return true;
  if (!ticketId) return false;
  let cart = cartLib.getCartByQr(ticketId);
  if (cart.legendary) return true;
  return false;
}
