import { getItemsList } from "../getItemsList";
import { isBlock } from "./getGameBlocks";

import { beautifyGameBlock } from "../block/beautifyGameBlock";

export { getGameBlocksByDay };

function getGameBlocksByDay(dayId: string) {
  let result = [];
  let blocks = getItemsList({
    parentId: dayId,
    type: "block",
    parentPathLike: true,
    sort: "data.datetime ASC"
  });
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (!isBlock(block)) continue;
    result.push(beautifyGameBlock(block));
  }
  return result;
}
