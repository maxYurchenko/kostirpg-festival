import { Game } from "../../../site/content-types/game/game";

const cartLib = require("/lib/cartLib");
const contentLib = __non_webpack_require__("/lib/xp/content");

export { validateTicketGameAllowed };

function validateTicketGameAllowed(
  ticketId: number | null,
  gameId: string,
  userHasTicket?: boolean
): boolean {
  const game = contentLib.get<Game>({ key: gameId });

  if (!game) return false;
  const regularTicket = !game.data.exclusive && userHasTicket ? true : false;
  if (regularTicket) return true;

  if (!ticketId) return false;

  const cart = cartLib.getCartByQr(ticketId);
  if (cart.legendary) return true;

  return false;
}
