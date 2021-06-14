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

export { bookSpace };

function bookSpace(
  gameId: string,
  kosticonnect2021: number,
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
  if (kosticonnect2021) {
    if (isNaN(kosticonnect2021)) {
      return {
        error: true,
        message: "Не правильный номер билета."
      };
    }
    if (!checkTicket(kosticonnect2021)) {
      return {
        error: true,
        message: "Такой билет не существует, или уже активирован."
      };
    }
  }
  if (user && user.data && user.content.data.kosticonnect2021) {
    kosticonnect2021 = user.content.data.kosticonnect2021;
  }
  if (!validateTicketGameAllowed(kosticonnect2021, game._id)) {
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
    (user.content.data.kosticonnect2021 || user?.data?.roles?.gameMaster)
  ) {
    let signInResult = signForGame(gameId);
    if (!signInResult.error) {
      return { error: false, message: "Вы записаны на игру." };
    }
  } else if (
    (firstName || kosticonnect2021) &&
    user &&
    user.content.data.discord
  ) {
    updateUser(kosticonnect2021, firstName);
    let signInResult = signForGame(gameId);
    if (!signInResult.error) {
      return { error: false, message: "Вы записаны на игру." };
    }
  } else if ((firstName || kosticonnect2021) && user) {
    updateUser(kosticonnect2021, firstName);
    saveDataToCart({
      game: game,
      firstName: firstName,
      kosticonnect2021: user.content.data.kosticonnect2021
        ? user.content.data.kosticonnect2021
        : kosticonnect2021,
      players: players,
      cartId: cartId
    });
    return { error: false };
  } else if (firstName && kosticonnect2021) {
    saveDataToCart({
      game: game,
      firstName: firstName,
      kosticonnect2021: kosticonnect2021,
      players: players,
      cartId: cartId
    });
    return { error: false };
  }
  return { error: true };
}
