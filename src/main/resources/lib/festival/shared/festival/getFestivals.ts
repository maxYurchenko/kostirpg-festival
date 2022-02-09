const portal = __non_webpack_require__("/lib/xp/portal");

import { getItemsList } from "../getItemsList";

export { getFestivals };

function getFestivals() {
  return getItemsList({
    type: "landing",
    additionalQuery: " AND data.gmRegisterOpen = 'true'"
  });
}
