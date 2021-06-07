import { getItemsList } from "../getItemsList";

export { getAllGamesByBlock };

function getAllGamesByBlock(id: string) {
  return getItemsList({ parentId: id, type: "game" });
}
