import { Content } from "enonic-types/content";
import { botApiResponse } from "../../../types/botApiResponse";
import { Cart } from "../../../types/cart";
import { User } from "../../../types/user";
import { updateEntity } from "../shared/updateEntity";
import * as contextLib from "./../helpers/contextLib";

const cartLib = require("/lib/cartLib");
const contentLib = __non_webpack_require__("/lib/xp/content");

interface reqParams {
  discordId?: string;
  ticketId?: number;
}

function checkUser(params?: reqParams): botApiResponse {
  if (!params) {
    return { success: false, message: "Необходим билет и дискорд!" };
  }
  const { ticketId, discordId } = params;
  if (!ticketId) return { success: false, message: "Необходим билет!" };
  if (!discordId) return { success: false, message: "Необходим дискорд!" };

  let cart: Cart = cartLib.getCartByQr(ticketId);
  if (!cart) return { success: false, message: "Билет не найден." };

  let user = getUserByTicket(ticketId);
  if (user) {
    if (!user.data.discord) {
      user.data.discord = discordId;
      contextLib.runAsAdmin(function () {
        if (user) updateEntity(user);
      });
    }
    return { success: true, data: { turbo: cart.legendary } };
  }

  if (!cart.qrActivated) {
    contextLib.runAsAdmin(function () {
      cartLib.markTicketUsed(params.ticketId);
    });
    return { success: true, data: { turbo: cart.legendary } };
  }

  return { success: false, message: "Билет не найден." };
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
