import { UserAllData } from "../../types/kostiUser";

const contentLib = __non_webpack_require__("/lib/xp/content");
const userLib = __non_webpack_require__("/lib/userLib");

export { getGamesByPlayer };

function getGamesByPlayer() {
  let user: UserAllData = userLib.getCurrentUser();
  if (!user) return [];
  return contentLib.query({
    start: 0,
    count: -1,
    query: "data.players = '" + user.content._id + "'",
    contentTypes: [app.name + ":game"]
  }).hits;
}
