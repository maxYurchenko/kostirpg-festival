const utils = __non_webpack_require__("/lib/util");

export { getTablesStartNum };

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
