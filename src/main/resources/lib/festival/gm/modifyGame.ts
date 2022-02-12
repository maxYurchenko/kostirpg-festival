const contentLib = __non_webpack_require__("/lib/xp/content");
const userLib = __non_webpack_require__("/lib/userLib");
const i18nLib = __non_webpack_require__("/lib/xp/i18n");
import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import { UserAllData } from "../../../types/kostiUser";
import * as contextLib from "../helpers/contextLib";
import { Valid } from "../../../types/validation";

export { modifyGame };

function modifyGame(game: Content<Game>): Valid {
  var user: UserAllData = userLib.getCurrentUser();
  var game = contentLib.modify<Game>({
    key: game._id,
    editor: function (c) {
      let players = c.data.players;
      c.displayName = game.displayName;
      game.data.location = c.data.location;
      game.data.master = c.data.master;
      game.data.block = c.data.block ? c.data.block : game.data.block;
      game.data.datetime = c.data.datetime;
      game.data.exclusive = user.data?.roles.turbomaster ? true : false;
      c.data = game.data;
      c.data.players = players;
      return c;
    }
  });

  contextLib.runAsAdminAsUser(user.user, function () {
    contentLib.publish({
      keys: [game._id],
      sourceBranch: "master",
      targetBranch: "draft",
      includeDependencies: false
    });
  });

  return {
    error: false,
    message: i18nLib.localize({
      key: "myGames.form.message.modified",
      locale: "ru"
    }),
    data: game
  };
}
