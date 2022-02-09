const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");
const userLib = __non_webpack_require__("/lib/userLib");

import { UserAllData } from "../../../types/kostiUser";
import { gameSpaceAvailable } from "../shared/game/gameSpace";
import { updateUser } from "../player/updateUser";
import { checkTicket } from "../player/checkTicket";
import { signForGame } from "../player/signForGame";
import { saveDataToCart } from "../player/saveDataToCart";
import { Game } from "../../../site/content-types/game/game";
import { validateTicketGameAllowed } from "../player/validateTicketGameAllowed";
import { Valid, validationFailed } from "../../../types/validation";

export { bookSpace };

function bookSpace(
  gameId: string,
  ticketId: number,
  firstName: string,
  cartId: string
): Valid {
  let game = contentLib.get<Game>({ key: gameId });
  if (!game) {
    return { error: true };
  }
  if (!gameSpaceAvailable(gameId)) {
    return { error: true, message: "Мест больше нет." };
  }

  let players = game.data.players;
  if (!players) {
    players = [];
  }
  players = utils.data.forceArray(players);
  if (!players) {
    players = [];
  }

  let user: UserAllData = userLib.getCurrentUser();
  if (ticketId) {
    if (isNaN(ticketId)) {
      return {
        error: true,
        message: "Не правильный номер билета."
      };
    }
    if (!checkTicket(ticketId)) {
      return {
        error: true,
        message: "Такой билет не существует, или уже активирован."
      };
    }
  }
  if (user && user.data && user.content.data.kosticonnect2022) {
    ticketId = user.content.data.kosticonnect2022;
  }
  const userHasTicket =
    ticketId || user?.data?.roles.gameMaster || user?.data?.roles.moderator
      ? true
      : false;

  if (!validateTicketGameAllowed(ticketId, game._id, userHasTicket)) {
    return {
      error: true,
      message: "Ваш билет не позволяет принять участие в этой игре."
    };
  }

  if (
    user &&
    user.content.data &&
    user.content.data.firstName &&
    user.content.data.discord &&
    (user.content.data.kosticonnect2022 || user?.data?.roles?.gameMaster)
  ) {
    const signInResult = signForGame({ gameId: gameId });
    if (!validationFailed(signInResult)) {
      return { error: false, message: "Вы записаны на игру." };
    }
  } else if ((firstName || ticketId) && user && user.content.data.discord) {
    updateUser(ticketId, firstName);
    const signInResult = signForGame({ gameId: gameId });
    if (!validationFailed(signInResult)) {
      return { error: false, message: "Вы записаны на игру." };
    }
  } else if ((firstName || ticketId) && user) {
    updateUser(ticketId, firstName);
    saveDataToCart({
      game: game,
      firstName: firstName,
      ticketId: user.content.data.kosticonnect2022
        ? user.content.data.kosticonnect2022
        : ticketId,
      players: players,
      cartId: cartId
    });
    return {
      error: false,
      message: "Билет действителен! Осталось только подключить дискорд."
    };
  } else if (firstName && ticketId) {
    saveDataToCart({
      game: game,
      firstName: firstName,
      ticketId: ticketId,
      players: players,
      cartId: cartId
    });
    return {
      error: false,
      message: "Билет действителен! Авторизируйтесь через дискорд."
    };
  }
  return { error: true, message: "Не удалось записать вас на игру" };
}
