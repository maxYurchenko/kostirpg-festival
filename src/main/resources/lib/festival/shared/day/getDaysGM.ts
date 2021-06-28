import { Block } from "../../../../site/content-types/block/block";
import { getFestivals } from "../festival/getFestivals";
import { beautifyDay } from "./beautifyDay";
const contentLib = __non_webpack_require__("/lib/xp/content");

export { getDays };

function getDays(skipBeautify?: boolean, expanded?: string) {
  let festivals = getFestivals();
  let id;
  let result = [];
  if (festivals && festivals[0]) {
    id = festivals[0]._id;
  } else {
    return [];
  }
  let festivalPage = contentLib.get({ key: id });
  if (!festivalPage) return [];
  let days = contentLib.query<Block>({
    query:
      "_parentPath LIKE '/content" +
      festivalPage._path +
      "*' AND data.blockType = 'day'",
    contentTypes: [app.name + ":gameBlock", app.name + ":block"],
    sort: "data.datetime ASC",
    count: 10
  }).hits;
  if (!skipBeautify) {
    for (let i = 0; i < days.length; i++) {
      result.push(beautifyDay(days[i], expanded));
    }
  }
  return result;
}
