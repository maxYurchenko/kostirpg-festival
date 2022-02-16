import { Game } from "../../../site/content-types/game/game";
import { User } from "../../../types/user";
import { Valid } from "../../../types/validation";

const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

import { getTablesStartNum } from "./../shared/game/getGameTable";
import { getComingTimeFilter } from "./filters/coming";
import { getTodayTimeFilter } from "./filters/today";
import { getUserFilter } from "./filters/user";

export { getGames };

function getGames(filter?: string, userId?: string): Valid {
  let query: string;
  switch (filter) {
    case "today":
      query = getTodayTimeFilter();
      break;
    case "user":
      query = getUserFilter(userId);
      break;
    default:
      query = getComingTimeFilter();
      break;
  }
  if (!query) return { error: true, message: "Не выбран фильтр" };

  const result = [];
  const games = contentLib.query<Game>({
    query: query,
    start: 0,
    count: -1,
    contentTypes: [app.name + ":game"],
    sort: "_parentPath ASC"
  }).hits;

  let tables = 0;
  let j = 0;

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const currTables = getTablesStartNum(game._id);
    if (tables !== currTables) {
      tables = currTables;
      j = 0;
    }

    const players: Player[] = [];
    game.data.players = game.data.players ? game.data.players : [];
    game.data.players = utils.data.forceArray(game.data.players);

    if (!game.data.players) continue;

    game.data.players.forEach((player: string) => {
      if (!player) return;

      const playerContent = contentLib.get<User>({ key: player });
      if (playerContent && playerContent.data.discord)
        players.push({
          discord: playerContent.data.discord,
          displayName: playerContent.displayName
        });
      else if (playerContent)
        players.push({ displayName: playerContent.displayName });
    });

    const master = contentLib.get<User>({ key: game.data.master });
    result.push({
      displayName: game.displayName,
      table: currTables + j,
      dateTimeStart: game.data.datetime,
      dateTimeEnd: game.data.datetimeEnd,
      master: master
        ? {
            discord: master.data.discord,
            displayName: master.displayName
          }
        : null,
      players: players
    });
    j++;
  }
  return { error: false, data: result };
}

interface Player {
  discord?: string;
  displayName: string;
}
