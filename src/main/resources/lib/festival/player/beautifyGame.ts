import { Content } from "enonic-types/content";
import { Game } from "../../site/content-types/game/game";
import { User } from "../../types/user";

const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

import { getGameMisc } from "../shared/getGameMisc";
import { getImage } from "../helpers/image";

export { beautifyGame };

function beautifyGame(game: Content<Game>): BeautifiedData {
  let beautifiedData: BeautifiedData = {
    block: beautifyGameBlock(null, utils.content.getParent({ key: game._id })),
    additionalInfo: getGameMisc(game),
    url: portal.pageUrl({ id: game._id }),
    intro:
      game.data.description.replace(/(<([^>]+)>)/gi, "").substring(0, 250) +
      "...",
    master: contentLib.get<User>({ key: game.data.master }),
    seatsReserved: game.data.players
      ? utils.data.forceArray(game.data.players).length
      : 0,
    system: {
      localizable: game.data.gameSystem._selected === "select",
      text: game.data.gameSystem[game.data.gameSystem._selected].system
    },
    image: {},
    bigImage: {}
  };
  if (game.data.image) {
    beautifiedData.image = getImage(game.data.image, "block(321, 181)");
    beautifiedData.bigImage = getImage(game.data.image, "width(1300)");
  }
  return beautifiedData;
}

interface BeautifiedData {
  system: {
    text: string;
    localizable: boolean;
  };
  image: object;
  bigImage: object;
  additionalInfo: string;
  url: string;
  intro: string;
  seatsReserved: number;
  master: any;
  block: any;
}
