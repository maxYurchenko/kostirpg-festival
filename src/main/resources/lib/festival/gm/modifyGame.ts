const contentLib = __non_webpack_require__("/lib/xp/content");
import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import * as contextLib from "../helpers/contextLib";

export { modifyGame };

function modifyGame(game: Content<Game>): Valid {
  var user = userLib.getCurrentUser();
  game.data.master = user._id;
  var game = contentLib.modify<Game>({
    key: game._id,
    editor: function (c) {
      let players = c.data.players;
      c.displayName = game.displayName;
      game.data.location = c.data.location;
      game.data.block = c.data.block;
      c.data = game.data;
      c.data.players = players;
      return c;
    }
  });

  contextLib.runAsAdminAsUser(user, function () {
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
      key: "myGames.form.message.modified"
    }),
    data: game
  };
}
