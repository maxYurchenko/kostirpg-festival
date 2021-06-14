import { Content } from "enonic-types/content";

const utils = __non_webpack_require__("/lib/util");

export { getFestivalByDay, getFestivalByDays };

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

function getFestivalByDays(arr: Array<Content> | string[] | string) {
  arr = utils.data.forceArray(arr);
  if (arr[0] && typeof arr[0] === "string") {
    return getFestivalByDay(arr[0]);
  } else if (arr && typeof arr === "string") {
    return getFestivalByDay(arr);
  } else if (arr[0] && typeof arr[0] !== "string") {
    return getFestivalByDay(arr[0]._id);
  }
}
