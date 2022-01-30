import { UserAllData } from "../../../types/kostiUser";
import { getFestivalByChild } from "../shared/festival/getFestivalByChild";

const cartLib = require("/lib/cartLib");
const userLib = __non_webpack_require__("/lib/userLib");
const utils = __non_webpack_require__("/lib/util");

export { checkTicket };

function checkTicket(ticketId: number, gameId?: string): boolean {
  if (isNaN(ticketId)) {
    return false;
  }
  const cart = cartLib.getCartByQr(ticketId);
  if (!cart) return false;

  if (gameId) {
    const festival = getFestivalByChild(gameId);
    if (!festival) return false;
    const tickets = utils.data.forceArray(festival.page.config.tickets);
    let valid = false;
    tickets.forEach((t: string) => {
      if (cart.qrProduct && t === cart.qrProduct._id) {
        valid = true;
        return;
      }
    });
    if (!valid) return false;
  }

  let user: UserAllData = userLib.getCurrentUser();
  let userTicket =
    user && user.data && user.content.data.kosticonnect2022
      ? user.content.data.kosticonnect2022
      : null;
  if (userTicket && user.content.data.kosticonnect2022 === ticketId) {
    return true;
  } else if (cart.currentFriendlyId && !cart.qrActivated) {
    return true;
  }
  return false;
}
