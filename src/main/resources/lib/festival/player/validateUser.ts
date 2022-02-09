import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import { UserAllData } from "../../../types/kostiUser";
import { validateTicketGameAllowed } from "./validateTicketGameAllowed";
import { validateUserAvailable } from "./validateUserAvailable";
import { validationFailed, Valid } from "../../../types/validation";
import validateFestivalRegisterStarted from "./validateFestivalRegisterStarted";
import checkUserInFestivalList from "./checkUserInFestivalList";

const utils = __non_webpack_require__("/lib/util");

export { validateUser };

function validateUser(game: Content<Game>, user: UserAllData): Valid {
  if (!user) return { error: true, message: "Вам нужно войти." };

  const userAvailable = validateUserAvailable(game, user);
  if (validationFailed(userAvailable)) return userAvailable;

  const ticketId = user.content.data.kosticonnect2022
    ? user.content.data.kosticonnect2022
    : null;
  const discord = user.content.data.discord;

  const userInFestivalList = checkUserInFestivalList(game, user);
  if (
    !validationFailed(userInFestivalList) &&
    validateTicketGameAllowed(null, game._id, true)
  ) {
    return userInFestivalList;
  }

  const registerStarted = validateFestivalRegisterStarted(
    ticketId,
    game,
    user.content._id
  );
  if (validationFailed(registerStarted)) {
    return registerStarted;
  }

  const userHasTicket =
    ticketId || user?.data?.roles?.gameMaster || user?.data?.roles?.moderator
      ? true
      : false;

  if (!userHasTicket)
    return {
      error: true,
      message: "Вам нужен билет чтоб записатся."
    };

  if (!discord)
    return {
      error: true,
      message: "Вам нужно подключить дискорд чтоб записатся."
    };

  if (!validateTicketGameAllowed(ticketId, game._id, userHasTicket)) {
    return {
      error: true,
      message: "Ваш билет не позволяет принять участие в этой игре."
    };
  }

  return {
    error: false
  };
}
