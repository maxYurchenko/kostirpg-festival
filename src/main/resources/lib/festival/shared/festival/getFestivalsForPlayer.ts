import { getItemsList } from "../getItemsList";

export { getFestivalsForPlayer };

function getFestivalsForPlayer() {
  let result: any = [];
  let festivals = getItemsList({
    type: "landing"
  });
  festivals.forEach((festival, index) => {
    let fest: any = festival;
    fest.online = fest.data && fest.data.onlineFestival;
    result.push(fest);
  });
  return result;
}
