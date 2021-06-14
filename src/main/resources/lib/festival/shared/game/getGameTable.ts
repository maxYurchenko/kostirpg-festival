import { Content } from "enonic-types/content";
import { Game } from "../../../../site/content-types/game/game";
import { getItemsList } from "../getItemsList";

const utils = __non_webpack_require__("/lib/util");
const cacheLib = require("../../helpers/cache");

const cache = cacheLib.api.createGlobalCache({
  name: "users",
  size: 1000,
  expire: 60 * 60 * 24
});

export { getGameTable, getTablesStartNum };

function getGameTable(game: Content<Game>): number {
  if (!game) return 0;
  let table = cache.api.getOnly(game._id + "-table");
  if (!table || table === 0) {
    table = countGameTable(game);
    if (table) cache.api.put(game._id + "-table", table);
  }
  return table;
}

function countGameTable(game: Content<Game>) {
  let result = 0;
  let block = utils.content.getParent({ key: game._id });
  let tables = getTablesStartNum(game._id);
  let allGamesBlock = cache.api.getOnly(block._id + "-games");
  if (!allGamesBlock || allGamesBlock.length === 0) {
    allGamesBlock = getItemsList({
      parentId: block._id,
      parentPathLike: true,
      type: "game"
    });
    if (allGamesBlock) cache.api.put(block._id + "-games", allGamesBlock);
  }
  for (let i = 0; i < allGamesBlock.length; i++) {
    if (game._id === allGamesBlock[i]._id) {
      result = tables + i;
    }
  }
  return result.toFixed();
}

function getTablesStartNum(gameId: string): number {
  let block = utils.content.getParent({ key: gameId });
  let blockNumber = null;
  let tables = 0;
  if (block && block.data && block.data.blockNumber) {
    blockNumber = parseInt(block.data.blockNumber);
  }
  blockNumber && blockNumber % 2 === 1 ? (tables = 1) : (tables = 25);
  return tables;
}
