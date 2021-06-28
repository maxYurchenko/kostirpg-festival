import { getItemsList } from "../getItemsList";

export { getLocations };

function getLocations(dayId: string) {
  return getItemsList({
    parentId: dayId,
    type: "location"
  });
}
