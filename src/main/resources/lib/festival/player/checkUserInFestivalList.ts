import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import { UserAllData } from "../../../types/kostiUser";
import { Valid } from "../../../types/validation";
import { getFestivalByDay } from "../shared/festival/getFestivalByDay";
import { beautifyGame } from "../shared/game/beautifyGame";

const utils = __non_webpack_require__("/lib/util");

export default checkUserInFestivalList;

function checkUserInFestivalList(
  game: Content<Game>,
  user: UserAllData
): Valid {
  let festival;
  let gameProcessed = beautifyGame(game);
  if (gameProcessed.processed.day?.content._id) {
    festival = getFestivalByDay(gameProcessed.processed.day?.content._id);
  } else {
    return {
      error: true,
      message: "Событие не найдено."
    };
  }
  if (festival.data.freeGames === true) {
    return {
      error: false
    };
  }
  let playersList = utils.data.forceArray(festival.data.players);
  if (playersList.indexOf(user.content._id) === -1) {
    return {
      error: true,
      message: "У вас нет доступа, чтоб записатся на эту игру."
    };
  }
  return {
    error: false
  };
}
