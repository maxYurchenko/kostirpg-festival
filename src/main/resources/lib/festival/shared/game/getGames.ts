import { getItemsList } from "../getItemsList";
import { beautifyGame, isGame } from "./beautifyGame";
import { ProcessedGame } from "./beautifyGame";
const utils = __non_webpack_require__("/lib/util");

export { getGames };

function getGames(params: GamesFilters) {
  let query = "";
  if (params.day) {
    query += " and data.day = '" + params.day + "'";
  }
  if (params.system) {
    " and data.gameSystem.select.system = '" + params.system + "'";
  }
  if (params.theme) {
    params.theme = utils.data.forceArray(params.theme);
    if (params.theme)
      query += " AND data.theme in ('" + params.theme.join("','") + "')";
  }
  let games = getItemsList({
    type: "game",
    additionalQuery: query,
    sort: "data.datetime ASC",
    start: params.start ? params.start : 0,
    count: params.count ? params.count : 10
  });
  let result: Array<ProcessedGame> = [];
  games.forEach((game) => {
    if (isGame(game)) result.push(beautifyGame(game));
  });
  return result;
}

export interface GamesFilters {
  day?: string;
  system?: string;
  theme?: string[];
  gameSpace?: "free" | "full" | "";
  start?: number;
  count?: number;
}
