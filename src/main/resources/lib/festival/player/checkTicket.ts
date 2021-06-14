import { UserAllData } from "../../../types/kostiUser";

const cartLib = require("/lib/cartLib");
const userLib = __non_webpack_require__("/lib/userLib");

export { checkTicket };

function checkTicket(kosticonnect2021: number): boolean {
  if (isNaN(kosticonnect2021)) {
    return false;
  }
  let cart = cartLib.getCartByQr(kosticonnect2021);
  if (!cart) return false;
  let user: UserAllData = userLib.getCurrentUser();
  let userTicket =
    user && user.data && user.content.data.kosticonnect2021
      ? user.content.data.kosticonnect2021
      : null;
  if (userTicket && user.content.data.kosticonnect2021 === kosticonnect2021) {
    return true;
  } else if (cart.currentFriendlyId && !cart.qrActivated) {
    return true;
  }
  return false;
}
