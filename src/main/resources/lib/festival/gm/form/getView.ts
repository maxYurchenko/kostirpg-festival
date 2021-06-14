const utils = __non_webpack_require__("/lib/util");

import { getFestivalByDay } from "../../shared/festival/getFestivalByDay";
import { getLocations } from "../../shared/location/getLocations";
import { getGameBlocks } from "../../shared/block/getGameBlocks";
import { getDays, DaysFilters } from "../../shared/day/getDays";
import { getFestivalByDays } from "../../shared/festival/getFestivalByDay";
import { getFormComponent } from "./getForm";

export { getView };

function getView(viewType: string, id: string, params: DaysFilters) {
  switch (viewType) {
    case "locationAndGameBlockComp":
      return getLocationsGameBlocksModel(id);
    case "gameBlocksComp": {
      return getGameBlocksModel(id);
    }
    case "scheduleComp":
    case "gmComp":
      return getScheduleModel(params);
    case "addGameForm":
      return getFormComponent(id);
  }
  return {};
}

function getLocationsGameBlocksModel(id: string) {
  let locations = getLocations(id);
  let festival = getFestivalByDay(id);
  return {
    locations: locations,
    festival: festival,
    blocks: getGameBlocks(locations[0]._id)
  };
}

function getGameBlocksModel(id: string) {
  let day = utils.content.getParent({ key: id });
  return {
    blocks: getGameBlocks(id),
    festival: getFestivalByDay(day._id)
  };
}

function getScheduleModel(params: DaysFilters) {
  let days = getDays(params);
  return {
    days: days,
    festival: getFestivalByDays([days[0].content._id])
  };
}
