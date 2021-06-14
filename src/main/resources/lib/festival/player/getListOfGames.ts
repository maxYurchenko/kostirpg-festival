import { Game } from "../../../site/content-types/game/game";

const contentLib = __non_webpack_require__("/lib/xp/content");

export { getListOfGames };

function getListOfGames() {
  var date = new Date();
  date.setTime(date.getTime() - 60 * 60 * 1000);
  let games = contentLib.query<Game>({
    start: 0,
    count: -1,
    contentTypes: [app.name + ":game"]
  });
  return games.hits;
}
