const userLib = __non_webpack_require__("/lib/userLib");
const utils = __non_webpack_require__("/lib/util");

import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import { UserAllData } from "../../../types/kostiUser";
import { validateTicketGameAllowed } from "./validateTicketGameAllowed";
import { validateUserAvailable } from "./validateUserAvailable";
import { validateMoscowPlayer } from "./validateMoscowPlayer";
import { User } from "../../../types/user";
import { validationFailed, Valid } from "../../../types/validation";
import { beautifyGame } from "../shared/game/beautifyGame";
import { getFestivalByDay } from "../shared/festival/getFestivalByDay";

export { validateUser };

function validateUser(game: Content<Game>, user: UserAllData): Valid {
  if (!user) return { error: true, message: "Вам нужно войти." };

  const userAvailable = validateUserAvailable(game, user);
  if (validationFailed(userAvailable)) return userAvailable;

  const userInFestivalList = checkUserInFestivalList(game, user);
  if (
    !validationFailed(userInFestivalList) &&
    validateTicketGameAllowed(null, game._id)
  ) {
    return userInFestivalList;
  }

  const ticketId = user.content.data.kosticonnect2022;
  const discord = user.content.data.discord;
  if (
    !(
      discord &&
      (ticketId ||
        user?.data?.roles?.gameMaster ||
        user?.data?.roles?.moderator)
    )
  )
    return {
      error: true,
      message: "Вам нужен билет чтоб записатся."
    };
  if (!ticketId || !validateTicketGameAllowed(ticketId, game._id)) {
    return {
      error: true,
      message: "Ваш билет не позволяет принять участие в этой игре."
    };
  }

  return {
    error: false
  };
}

function checkUserInFestivalList(
  game: Content<Game>,
  user: UserAllData
): Valid {
  let festival;
  let gameProcessed = beautifyGame(game);
  if (gameProcessed.processed.day?.content._id) {
    festival = getFestivalByDay(gameProcessed.processed.day?.content._id);
  } else {
    return {
      error: true,
      message: "Событие не найдено."
    };
  }
  if (festival.data.freeGames === true) {
    return {
      error: false
    };
  }
  let playersList = utils.data.forceArray(festival.data.players);
  if (playersList.indexOf(user.content._id) === -1) {
    return {
      error: true,
      message: "У вас нет доступа, чтоб записатся на эту игру."
    };
  }
  return {
    error: false
  };
}
