const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");

import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import { UserAllData } from "../../../types/kostiUser";
import { Valid } from "../../../types/validation";

export { validateUserAvailable };

function validateUserAvailable(game: Content<Game>, user: UserAllData): Valid {
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
  return { error: false };
}
