import { Content } from "enonic-types/content";
import { Cart } from "../../../types/cart";
import { User } from "../../../types/user";
import { Valid } from "../../../types/validation";
import { updateEntity } from "../shared/updateEntity";
import * as contextLib from "./../helpers/contextLib";

const cartLib = require("/lib/cartLib");
const contentLib = __non_webpack_require__("/lib/xp/content");

interface reqParams {
  discordId?: string;
  ticketId?: number;
}

function checkUser(params?: reqParams): Valid {
  if (!params) {
    return { error: true, message: "Необходим билет и дискорд!" };
  }
  const { ticketId, discordId } = params;
  if (!ticketId) return { error: true, message: "Необходим билет!" };
  if (!discordId) return { error: true, message: "Необходим дискорд!" };

  let cart: Cart = cartLib.getCartByQr(ticketId);
  if (!cart) return { error: true, message: "Билет не найден." };

  let user = getUserByTicket(ticketId);
  if (user) {
    if (!user.data.discord) {
      user.data.discord = discordId;
      contextLib.runAsAdmin(function () {
        if (user) updateEntity(user);
      });
    }
    return { error: false, data: { turbo: cart.legendary } };
  }

  if (!cart.qrActivated) {
    contextLib.runAsAdmin(function () {
      cartLib.markTicketUsed(params.ticketId);
    });
    return { error: false, data: { turbo: cart.legendary } };
  }

  return { error: true, message: "Билет не найден." };
}

function getUserByTicket(ticketId: number): Content<User> | null {
  if (!ticketId) return null;
  let users = contentLib.query<User>({
    query: "data.kosticonnect2022 = " + ticketId,
    start: 0,
    count: 1,
    contentTypes: [app.name + ":user"]
  });
  if (users.hits[0]) return users.hits[0];
  return null;
}

export default checkUser;
