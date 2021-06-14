import { getFestivals } from "./getFestivals";

export { getActiveFestival };

function getActiveFestival() {
  let festivals = getFestivals();
  if (festivals.length < 1) return null;
  let fest: any = festivals[0];
  fest.online = fest && fest.onlineFestival;
  return fest;
}
