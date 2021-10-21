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

function getFestivalForGM(festId: string) {
  let user: UserAllData = userLib.getCurrentUser();
  let roles = [];
  let result: any = [];
  for (let role in user.data?.roles) {
    roles.push(role);
  }
  let festivals = getItemsList({
    type: "landing",
    additionalQuery:
      " AND data.gameRegisterOpen = 'true' and data.gmRole in ('" +
      roles.join("','") +
      "')"
  });
  festivals.forEach((festival, index) => {
    let fest: any = festival;
    if (!festId && index === 0) fest.active = true;
    if (festId === fest._id) fest.active = true;
    fest.online = fest.data && fest.data.onlineFestival;
    if (fest.active) result.unshift(fest);
    else result.push(fest);
  });
  return result;
}
