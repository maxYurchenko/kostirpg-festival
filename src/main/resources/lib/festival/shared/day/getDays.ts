import { getItemsList } from "../../shared/getItemsList";
import { getDay } from "./getDay";
import { getFirstDay } from "../day/getFirstDay";
import { getGameBlocksByDay } from "../block/getGameBlocksByDay";
import { beautifyGame, isGame } from "../game/beautifyGame";
import { DayProcessed } from "./beautifyDay";
import { BlockProcessed } from "../block/beautifyGameBlock";
const utils = __non_webpack_require__("/lib/util");

export { getDays };

function getDays(params: DaysFilters) {
  if (!params) params = {};
  let days: DayProcessed[] = [];
  if (params.day) {
    days = getDay(params.day);
  } else {
    days = getFirstDay();
  }
  let gamesQuery = "";
  if (params.system) {
    gamesQuery +=
      " and data.gameSystem.select.system = '" + params.system + "'";
  }
  if (params.theme) {
    params.theme = utils.data.forceArray(params.theme);
    if (params.theme)
      gamesQuery += " AND data.theme in ('" + params.theme.join("','") + "')";
  }
  days.forEach((day: DayProcessed) => {
    day.processed.blocks = getGameBlocksByDay(day.content._id);
    day.processed.blocks.forEach((block: BlockProcessed) => {
      let games = getItemsList({
        parentId: block.content._id,
        parentPathLike: true,
        type: "game",
        additionalQuery: gamesQuery
      });
      let result = [];
      block.processed.games = [];
      for (let i = 0; i < games.length; i++) {
        let game = games[i];
        if (!isGame(game)) continue;
        if (!game.data.players) game.data.players = [];
        game.data.players = utils.data.forceArray(game.data.players);
        if (!game.data.players) game.data.players = [];
        if (
          (params.gameSpace === "free" &&
            game.data.players.length < parseInt(game.data.maxPlayers)) ||
          (params.gameSpace === "full" &&
            game.data.players.length >= parseInt(game.data.maxPlayers)) ||
          !params.gameSpace
        ) {
          result.push(beautifyGame(game));
        }
      }
      block.processed.games = result;
    });
  });
  return days;
}

export interface DaysFilters {
  day?: string;
  system?: string;
  theme?: string[];
  gameSpace?: "free" | "full" | "";
}
