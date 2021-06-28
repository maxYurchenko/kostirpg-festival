import { Block } from "../../../site/content-types/block/block";
import { UserAllData } from "../../../types/kostiUser";

const contentLib = __non_webpack_require__("/lib/xp/content");
const userLib = __non_webpack_require__("/lib/userLib");

export { checkIfMasterBookedThisBlock };

function checkIfMasterBookedThisBlock(
  blockId: string,
  locationId: string
): boolean {
  var gameBlock = contentLib.get<Block>({ key: blockId });
  if (!gameBlock) return false;
  var user: UserAllData = userLib.getCurrentUser();
  if (!user) return false;
  var games = contentLib.query({
    query:
      "data.location = '" +
      locationId +
      "' and _parentPath = '/content" +
      gameBlock._path +
      "' and data.master = '" +
      user.content._id +
      "'",
    start: 0,
    count: 0
  });
  if (games.total > 0) {
    return true;
  }
  return false;
}
