const utils = __non_webpack_require__("/lib/util");

import { getFestivalByDay } from "../../shared/festival/getFestivalByDay";
import { getLocations } from "../../shared/location/getLocations";
import { getGameBlocks } from "../../shared/block/getGameBlocks";
import { DaysFilters } from "../../shared/day/getDays";
import { getDays } from "../../shared/day/getDaysGM";
import { getFestivalByDays } from "../../shared/festival/getFestivalByDay";
import { getFormComponent } from "./getForm";

export { getViewModel };

function getViewModel(viewType: string, id: string, params: DaysFilters) {
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
  let model = {
    locations: locations,
    festival: festival,
    blocks: getGameBlocks(locations[0]._id)
  };
  return model;
}

function getGameBlocksModel(id: string) {
  let day = utils.content.getParent({ key: id });
  return {
    blocks: getGameBlocks(id),
    festival: getFestivalByDay(day._id)
  };
}

function getScheduleModel(params: DaysFilters) {
  let days = getDays();
  return {
    days: days,
    festival: getFestivalByDays([days[0].content._id])
  };
}
