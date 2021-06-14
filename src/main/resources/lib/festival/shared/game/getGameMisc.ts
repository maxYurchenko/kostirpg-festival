import { Content } from "enonic-types/content";
import { Game } from "../../../../site/content-types/game/game";
const i18nLib = __non_webpack_require__("/lib/xp/i18n");

export { getGameMisc };

function getGameMisc(game: Content<Game>) {
  let additionalInfo = [];
  if (game.data.kidsGame)
    additionalInfo.push(
      i18nLib.localize({
        key: "myGames.kidsGame"
      })
    );
  if (game.data.explicit)
    additionalInfo.push(
      i18nLib.localize({
        key: "myGames.explicit"
      })
    );
  if (game.data.beginnerFriendly)
    additionalInfo.push(
      i18nLib.localize({
        key: "myGames.beginnerFriendly"
      })
    );
  return additionalInfo.join(", ");
}
