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
  kosticonnect2021: number,
  firstName: string
): Content<User> | Valid {
  let user: UserAllData = userLib.getCurrentUser();
  if (!(user && user.data))
    return {
      error: true
    };

  let updateUser = false;
  if (kosticonnect2021 && !user.content.data.kosticonnect2021) {
    if (isNaN(kosticonnect2021)) {
      return {
        error: true,
        message: "Не правильный номер билета."
      };
    }
    if (checkTicket(kosticonnect2021)) {
      user.content.data.kosticonnect2021 = kosticonnect2021;
      updateUser = true;
      contextLib.runAsAdminAsUser(user.user, function () {
        cartLib.markTicketUsed(kosticonnect2021);
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
