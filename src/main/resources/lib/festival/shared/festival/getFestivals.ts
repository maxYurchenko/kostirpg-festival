const portal = __non_webpack_require__("/lib/xp/portal");

import { getItemsList } from "../getItemsList";

export { getFestivals };

function getFestivals() {
  var site = portal.getSite();
  return getItemsList({
    type: "landing",
    parentId: site._id,
    additionalQuery: " AND data.gameRegisterOpen = 'true'"
  });
}
