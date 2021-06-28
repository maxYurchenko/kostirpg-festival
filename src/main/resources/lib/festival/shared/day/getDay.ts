import { Block } from "../../../../site/content-types/block/block";
import { getFestivals } from "../festival/getFestivals";
import { beautifyDay, DayProcessed } from "./beautifyDay";
const contentLib = __non_webpack_require__("/lib/xp/content");

export { getDay };

function getDay(id: string): DayProcessed[] {
  let festivals = getFestivals();
  if (!festivals[0]) return [];
  let festivalPage = contentLib.get({ key: festivals[0]._id });
  if (!festivalPage) return [];
  let result = [];
  let days = contentLib.query<Block>({
    query:
      "_parentPath LIKE '/content" +
      festivalPage._path +
      "*' AND data.blockType = 'day'" +
      " AND _id = '" +
      id +
      "'",
    contentTypes: [app.name + ":gameBlock", app.name + ":block"],
    sort: "data.datetime ASC",
    count: 1
  }).hits;
  for (let i = 0; i < days.length; i++) {
    result.push(beautifyDay(days[i]));
  }
  return result;
}
