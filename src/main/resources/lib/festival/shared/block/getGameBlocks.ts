import { Content } from "enonic-types/content";
import { Block } from "../../../../site/content-types/block/block";
import { Game } from "../../../../site/content-types/game/game";
import { Location } from "../../../../site/content-types/location/location";
import { getItemsList } from "../getItemsList";
import { beautifyGameBlock, BlockProcessed } from "./beautifyGameBlock";

export { getGameBlocks };

function getGameBlocks(locationId: string): Array<BlockProcessed> {
  let result: Array<BlockProcessed> = [];
  let blocks = getItemsList({
    parentId: locationId,
    type: "gameBlock",
    sort: "data.datetime ASC"
  });
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (!isBlock(block)) continue;
    result.push(beautifyGameBlock(block, locationId));
  }
  return result;
}

export function isBlock(
  arg: Content<Block | Game | Location>
): arg is Content<Block> {
  return (arg as Content<Block>).data.blockType !== undefined;
}
