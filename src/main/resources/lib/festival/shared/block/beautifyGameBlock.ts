import { Content } from "enonic-types/content";
import { Block } from "../../../../site/content-types/block/block";
import { getLocationSpace, LocationSpace } from "../location/locationSpace";
import { getDayName, getMonthName, getTime } from "../../helpers/date";
import { ProcessedGame } from "../game/beautifyGame";

export { beautifyGameBlock, BlockProcessed };

function beautifyGameBlock(
  block: Content<Block>,
  locationId?: string
): BlockProcessed {
  let duration;
  let hoursDuration;
  let blockDate = new Date(block.data.datetime);
  if (block.data.datetimeEnd) {
    duration = new Date(block.data.datetimeEnd).getTime() - blockDate.getTime();
    hoursDuration = Math.floor(duration / 60 / 60 / 1000);
  }
  let result: BlockProcessed = {
    content: block,
    processed: {
      date: blockDate.getDate().toFixed(),
      dayName: getDayName(blockDate),
      monthName: getMonthName(blockDate),
      time: {
        start: getTime(blockDate),
        end: block.data.datetimeEnd
          ? getTime(new Date(block.data.datetimeEnd))
          : undefined
      },
      duration:
        duration && hoursDuration
          ? {
              hours: hoursDuration.toFixed(),
              minutes: (
                Math.floor(duration / 60 / 1000) -
                hoursDuration * 60
              ).toFixed()
            }
          : undefined,
      epic: !!(block.data.description && block.data.title),
      space: locationId ? getLocationSpace(locationId, block._id) : undefined
    }
  };
  return result;
}

interface BlockProcessed {
  content: Content<Block>;
  processed: {
    dayName: string;
    monthName: string;
    time: {
      start: string;
      end?: string;
    };
    duration?: {
      hours: string;
      minutes: string;
    };
    epic: boolean;
    space?: LocationSpace;
    date: string;
    games?: ProcessedGame[];
  };
}
