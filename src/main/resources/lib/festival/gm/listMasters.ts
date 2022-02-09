import { Content } from "enonic-types/content";
import { User } from "../../../types/user";
import { getGamesByUser } from "../shared/game/getGamesByUser";
import { getItemsList } from "../shared/getItemsList";

const contentLib = __non_webpack_require__("/lib/xp/content");
const authLib = __non_webpack_require__("/lib/xp/auth");
const utils = __non_webpack_require__("/lib/util");
const userLib = __non_webpack_require__("/lib/userLib");

export { listMasters };

interface Master {
  name: string;
  discordId: string;
  gamesAmount: number;
}

function listMasters(withGamesOnly: boolean): Master[] {
  const masters = authLib.getMembers("role:gamemaster");
  const mastersInFestival: Master[] = [];
  const currentFestival = "d437d64f-1d18-43c2-ae7b-397c28a7344f";
  masters.forEach((m) => {
    const masterContent: Content<User> = userLib.findUserContentType(m.email);
    if (!masterContent || !masterContent.data.discord) return;

    const games = getItemsList({
      parentId: currentFestival,
      parentPathLike: true,
      type: "game",
      sort: "_parentPath ASC",
      master: masterContent._id
    });
    if (games.length < 1 && withGamesOnly) return;

    mastersInFestival.push({
      name: masterContent.displayName,
      discordId: masterContent.data.discord,
      gamesAmount: games.length
    });
  });

  return mastersInFestival;
}
