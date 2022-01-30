import { Content } from "enonic-types/content";
import { UserAllData } from "../../../types/kostiUser";
import { User } from "../../../types/user";

import * as contextLib from "../helpers/contextLib";
import { updateEntity } from "../shared/updateEntity";
import { checkTicket } from "../player/checkTicket";
import { Valid } from "../../../types/validation";
const cartLib = require("/lib/cartLib");
const userLib = __non_webpack_require__("/lib/userLib");

export { updateUser };

function updateUser(
  ticketId: number,
  firstName: string
): Content<User> | Valid {
  let user: UserAllData = userLib.getCurrentUser();
  if (!(user && user.data))
    return {
      error: true
    };

  let updateUser = false;
  if (ticketId && !user.content.data.kosticonnect2022) {
    if (isNaN(ticketId)) {
      return {
        error: true,
        message: "Не правильный номер билета."
      };
    }
    if (checkTicket(ticketId)) {
      user.content.data.kosticonnect2022 = ticketId;
      updateUser = true;
      contextLib.runAsAdminAsUser(user.user, function () {
        cartLib.markTicketUsed(ticketId);
      });
    } else {
      return {
        error: true,
        message: "Такой билет не существует, или уже активирован."
      };
    }
  }
  if (
    (firstName && !user.content.data.firstName) ||
    (firstName && firstName !== user.content.data.firstName)
  ) {
    user.content.data.firstName = firstName;
    updateUser = true;
  }
  let updatedUser;
  if (updateUser) updatedUser = updateEntity(user.content);
  return updatedUser;
}
