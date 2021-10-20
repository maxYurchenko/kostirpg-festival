import { UserAllData } from "../../../../types/kostiUser";
import { DayProcessed } from "../day/beautifyDay";
import { getItemsList } from "../getItemsList";
const userLib = __non_webpack_require__("/lib/userLib");

const utils = __non_webpack_require__("/lib/util");

export { getFestivalByDay, getFestivalByDays, getFestivalForGM };

function getFestivalByDay(id: string) {
  let gamesFolder = utils.content.getParent({ key: id });
  if (gamesFolder) {
    let festival = utils.content.getParent({ key: gamesFolder._id });
    if (festival && festival.data) {
      festival.online = festival.data && festival.data.onlineFestival;
      return festival;
    }
  }
  return null;
}

function getFestivalByDays(arr: Array<DayProcessed> | string[] | string) {
  arr = utils.data.forceArray(arr);
  if (arr[0] && typeof arr[0] === "string") {
    return getFestivalByDay(arr[0]);
  } else if (arr && typeof arr === "string") {
    return getFestivalByDay(arr);
  } else if (arr[0] && typeof arr[0] !== "string") {
    return getFestivalByDay(arr[0].content._id);
  }
}

function getFestivalForGM() {
  let user: UserAllData = userLib.getCurrentUser();
  let roles = [];
  for (let role in user.data?.roles) {
    roles.push(role);
  }
  let result = getItemsList({
    type: "landing",
    additionalQuery:
      " AND data.gameRegisterOpen = 'true' and data.gmRole in ('" +
      roles.join("','") +
      "')"
  });
  if (!result || result.length < 1) return null;
  let festival: any = result[0];
  festival.online = festival.data && festival.data.onlineFestival;
  return festival;
}
