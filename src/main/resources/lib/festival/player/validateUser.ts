const userLib = __non_webpack_require__("/lib/userLib");

import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import { UserAllData } from "../../../types/kostiUser";
import { validateTicketGameAllowed } from "./validateTicketGameAllowed";
import { validateUserAvailable } from "./validateUserAvailable";
import { validateMoscowPlayer } from "./validateMoscowPlayer";
import { User } from "../../../types/user";
import { validationFailed, Valid } from "../../../types/validation";

export { validateUser };

function validateUser(game: Content<Game>, user: Content<User>): Valid {
  if (!user) return { error: true, message: "Вам нужно войти." };

  let userAvailable = validateUserAvailable(game, user);
  if (validationFailed(userAvailable)) return userAvailable;

  //let moscowPlayer = validateMoscowPlayer();
  //if (moscowPlayer.error) return moscowPlayer;

  /*
  let kosticonnect2021 = user.content.data.kosticonnect2021;
  let discord = user.content.data.discord;
  if (
    !(
      discord &&
      (kosticonnect2021 ||
        user?.data?.roles?.gameMaster ||
        user?.data?.roles?.moderator)
    )
  )
    return {
      error: true,
      message: "Вам нужен билет чтоб записатся."
    };
  if (
    !kosticonnect2021 ||
    !validateTicketGameAllowed(kosticonnect2021, game._id)
  ) {
    return {
      error: true,
      message: "Ваш билет не позволяет принять участие в этой игре."
    };
  }
  */
  return {
    error: false
  };
}
