import { Content } from "enonic-types/content";
import { Block } from "../../../site/content-types/block/block";
import { getLocationSpace } from "../locationSpace";

export { beautifyGameBlock };

function beautifyGameBlock(locationId: string, block: Content<Block>) {
  block.duration = {};
  if (block.data.datetimeEnd && block.data.datetime) {
    var duration =
      new Date(block.data.datetimeEnd) - new Date(block.data.datetime);
    var hours = Math.floor(duration / 60 / 60 / 1000);
    block.duration = {
      hours: hours.toFixed(),
      minutes: (Math.floor(duration / 60 / 1000) - hours * 60).toFixed()
    };
  }
  var blockDate = new Date(block.data.datetime);
  block.date = blockDate.getDate().toFixed();
  block.dayName = norseUtils.getDayName(blockDate);
  block.monthName = norseUtils.getMonthName(blockDate);
  block.time = {
    start: norseUtils.getTime(new Date(block.data.datetime)),
    end: block.data.datetimeEnd
      ? norseUtils.getTime(new Date(block.data.datetimeEnd))
      : null
  };
  block.epic = !!(block.data.description && block.data.title);
  if (locationId) {
    block.space = getLocationSpace(locationId, block._id);
  }
  return block;
}
