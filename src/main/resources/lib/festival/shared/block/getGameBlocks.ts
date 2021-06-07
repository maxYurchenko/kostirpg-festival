import { getItemsList } from "../getItemsList";

export { getGameBlocks };

function getGameBlocks(locationId: string) {
  var blocks = getItemsList({
    parentId: locationId,
    type: "gameBlock",
    sort: "data.datetime ASC"
  });
  for (var i = 0; i < blocks.length; i++) {
    blocks[i] = beautifyGameBlock(locationId, blocks[i]);
  }
  return blocks;
}
