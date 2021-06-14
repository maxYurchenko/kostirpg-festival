import { Content } from "enonic-types/content";
import { Block } from "../../../../site/content-types/block/block";
import { getLocations } from "../location/getLocations";
import { DaySpace, getDaySpace } from "./getDaySpace";
import { getDaysByUser } from "./getDaysByUser";
import { getDayName, getMonthName } from "../../helpers/date";
import { BlockProcessed } from "../block/beautifyGameBlock";
const userLib = __non_webpack_require__("/lib/userLib");

export { beautifyDay };

function beautifyDay(day: Content<Block>, expanded?: string): DayProcessed {
  let dayDate = new Date(day.data.datetime);
  let user = userLib.getCurrentUser();
  let result = {
    content: day,
    processed: {
      expanded: expanded === day._id,
      date: dayDate.getDate().toFixed(),
      dayName: getDayName(dayDate),
      monthName: getMonthName(dayDate),
      space: getDaySpace(day._id),
      locations: getLocations(day._id),
      games: getDaysByUser(day._id, user && user.roles && user.roles.moderator)
    }
  };
  return result;
}

export interface DayProcessed {
  content: Content<Block>;
  processed: {
    expanded?: boolean;
    date: string;
    dayName: string;
    monthName: string;
    space: DaySpace;
    locations: any;
    games: any;
    blocks?: BlockProcessed[];
  };
}
