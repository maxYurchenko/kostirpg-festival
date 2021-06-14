import { Game } from "../../../../site/content-types/game/game";
import { Location } from "../../../../site/content-types/location/location";
import { beautifyGame, isGame } from "../../shared/game/beautifyGame";
import { beautifyGameBlock } from "../../shared/block/beautifyGameBlock";
import { Block } from "../../../../site/content-types/block/block";
import { isBlock } from "../../shared/block/getGameBlocks";
import { beautifyDay } from "../../shared/day/beautifyDay";
import { getSelectOptions } from "../../shared/getSelectOptions";
import { getFestivalByDay } from "../../shared/festival/getFestivalByDay";

const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");
const userLib = __non_webpack_require__("/lib/userLib");
const cacheLib = require("../../helpers/cache");

export { getFormComponent };

const cache = cacheLib.api.createGlobalCache({
  name: "users",
  size: 1000,
  expire: 60 * 60 * 24
});

function getFormComponent(id?: string) {
  let content, action, game, block, location;
  let user = userLib.getCurrentUser();
  let discord = {};
  if (user && user.data && user.data.discord) {
    discord = cache.api.getOnly(user._id + "-discord");
    if (!discord) {
      discord = userLib.getDiscordData(user._id);
      if (discord) cache.api.put(user._id + "-discord", discord);
    }
  }
  if (id) content = contentLib.get<Game | Block>({ key: id });
  if (content && content.type === app.name + ":game" && isGame(content)) {
    game = beautifyGame(content);
    location = contentLib.get<Location>({ key: game.content.data.location });
    block = beautifyGameBlock(
      utils.content.getParent({ key: game.content._id }),
      location ? location._id : undefined
    );
    action = "editGame";
  } else if (content && isBlock(content)) {
    action = "addGame";
    game = null;
    location = utils.content.getParent({ key: id });
    if (content) block = beautifyGameBlock(content, location._id);
  }
  let day = beautifyDay(utils.content.getParent({ key: location._id }));
  return {
    action: action,
    game: game,
    block: block,
    discord: discord,
    location: location,
    user: user,
    virtualTables: getSelectOptions("virtualTable"),
    gameSystems: getSelectOptions("gameSystem"),
    themes: getSelectOptions("theme"),
    festival: getFestivalByDay(day.content._id),
    day: day
  };
}
