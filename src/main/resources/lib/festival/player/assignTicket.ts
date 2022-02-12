import { Cart } from "../../../types/cart";
import { UserAllData } from "../../../types/kostiUser";
import { Valid } from "../../../types/validation";
import { updateUser } from "./updateUser";

const utils = __non_webpack_require__("/lib/util");
const userLib = __non_webpack_require__("/lib/userLib");
const cartLib = require("/lib/cartLib");

export { assignTicket };

function assignTicket(ticketId: number): Valid {
  const user: UserAllData | null = userLib.getCurrentUser();
  if (!user) return { error: true, message: "Войдите чтоб подключить билет." };

  const cart: Cart | null = cartLib.getCartByQr(ticketId);
  if (!cart) return { error: true, message: "Билет не найден." };

  if (cart.qrActivated)
    return { error: true, message: "Билет уже активирован." };

  updateUser(
    ticketId,
    user.content.data.firstName ? user.content.data.firstName : ""
  );

  return {
    error: false,
    message: `Поключен ${
      cart.legendary ? "Турбо" : "Обычный"
    } билет Kosticonnect2022`
  };
}
