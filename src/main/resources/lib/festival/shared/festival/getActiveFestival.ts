import { getFestivals } from "./getFestivals";

export { getActiveFestival };

function getActiveFestival() {
  let festivals = getFestivals();
  if (festivals.length > 0) {
    festivals[0].online = festivals[0].data && festivals[0].data.onlineFestival;
    return festivals[0];
  }
}
