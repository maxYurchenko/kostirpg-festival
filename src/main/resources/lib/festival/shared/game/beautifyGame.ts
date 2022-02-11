import { Content } from "enonic-types/content";

const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");
const userLib = __non_webpack_require__("/lib/userLib");
const portal = __non_webpack_require__("/lib/xp/portal");
const cacheLib = require("../../helpers/cache");

import { getGameMisc } from "./getGameMisc";
import { getImage } from "../../helpers/image";
import { Game } from "../../../../site/content-types/game/game";
import { User } from "../../../../types/user";
import { beautifyGameBlock, BlockProcessed } from "../block/beautifyGameBlock";
import { getGameTable } from "../game/getGameTable";
import { Block } from "../../../../site/content-types/block/block";
import { Location } from "../../../../site/content-types/location/location";
import { beautifyDay, DayProcessed } from "../day/beautifyDay";

export { beautifyGame };

const cache = cacheLib.api.createGlobalCache({
  name: "users",
  size: 1000,
  expire: 60 * 60 * 24
});

function beautifyGame(game: Content<Game>): ProcessedGame {
  const system: any = game.data.gameSystem;
  const systemText = system[system._selected].system;
  const block: Content<Block> | null = contentLib.get<Block>({
    key: game.data.block
  });
  const location = contentLib.get<Location>({
    key: game.data.location
  });
  const user = userLib.getCurrentUser();
  const day = location ? utils.content.getParent({ key: location._id }) : null;
  const processedGame: ProcessedGame = {
    content: game,
    processed: {
      block: block ? beautifyGameBlock(block) : null,
      location: location ? location.displayName : null,
      day: day ? beautifyDay(day, undefined, false) : null,
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
        localizable: system._selected === "select",
        text: systemText
      },
      players: getPlayers(),
      currUserPlays:
        game?.data?.players &&
        (game?.data?.players.indexOf(user?.content?._id) !== -1 ||
          game?.data?.master === user?.content?._id)
          ? true
          : false,
      table: getGameTable(game)
    }
  };
  if (game.data.image) {
    processedGame.processed.image = getImage(
      game.data.image,
      "block(321, 181)"
    );
    processedGame.processed.bigImage = getImage(game.data.image, "width(1300)");
  }
  return processedGame;
}

function getPlayers(players?: string[]): string {
  if (!players) return "";
  let playersArray: string[] = [];
  players = utils.data.forceArray(players);
  if (!players) return "";
  players.forEach((player) => {
    let playerObj: any = contentLib.get({ key: player });
    if (playerObj) {
      let discord = null;
      if (playerObj && playerObj.data && playerObj.data.discord) {
        discord = cache.api.getOnly(playerObj._id + "-discord");
        if (!discord) {
          discord = userLib.getDiscordData(playerObj._id);
          if (discord) cache.api.put(playerObj._id + "-discord", discord);
        }
      }
      playersArray.push(
        playerObj.displayName +
          " " +
          (discord ? discord.username + ":" + discord.discriminator : "")
      );
    }
  });
  return playersArray.join(", ");
}

export interface ProcessedGame {
  content: Content<Game>;
  processed: {
    system: {
      text: string;
      localizable: boolean;
    };
    image?: object;
    bigImage?: object;
    additionalInfo: string;
    url: string;
    intro: string;
    seatsReserved: number;
    master: Content<User> | null;
    block: BlockProcessed | null;
    day: DayProcessed | null;
    location: string | null;
    players: string;
    table: string;
    currUserPlays: boolean;
  };
}

export function isGame(
  arg: Content<Block | Game | Location>
): arg is Content<Game> {
  return (arg as Content<Game>).data.master !== undefined;
}
