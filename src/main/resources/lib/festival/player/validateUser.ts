const contentLib = __non_webpack_require__("/lib/xp/content");
const userLib = __non_webpack_require__("/lib/userLib");

import { Content } from "enonic-types/content";
import { Game } from "../../site/content-types/game/game";
import { UserAllData } from "../../types/kostiUser";

export { validateUser };

function validateUser(game: Content<Game>): Valid {
  let user: UserAllData = userLib.getCurrentUser();
  if (!user) return { error: true, message: "Вам нужно войти." };
  let kosticonnect2021 = user.content.data.kosticonnect2021;
  let discord = user.content.data.discord;
  let gameBlock = utils.content.getParent({ key: game._id });
  let games = contentLib.query({
    start: 0,
    count: 1,
    query:
      "data.players = '" +
      user.content._id +
      "' and _parentPath = '/content" +
      gameBlock._path +
      "'",
    contentTypes: [app.name + ":game"]
  });
  if (games.total > 0)
    return {
      error: true,
      message: "Вы уже записаны на другую игру в этом блоке."
    };
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
  if (!validateTicketGameAllowed(kosticonnect2021, game._id)) {
    return {
      error: true,
      message: "Ваш билет не позволяет принять участие в этой игре."
    };
  }
  return {
    error: false
  };
}
