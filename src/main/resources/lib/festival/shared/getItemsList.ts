import { Content } from "enonic-types/content";
import { Block } from "../../../site/content-types/block/block";
import { Game } from "../../../site/content-types/game/game";
import { Location } from "../../../site/content-types/location/location";

const contentLib = __non_webpack_require__("/lib/xp/content");

export { getItemsList };

function getItemsList(filters: Filters) {
  var query = "type = '" + app.name + ":" + filters.type + "' ";
  if (filters.master) {
    query += "AND data.master = '" + filters.master + "'";
  }
  if (filters.location) {
    query += "AND data.location = '" + filters.location + "'";
  }
  if (filters.parentId) {
    var parent = contentLib.get({ key: filters.parentId });
    if (filters.parentPathLike && parent) {
      query += "and _parentPath like '/content" + parent._path + "*'";
    } else if (parent) {
      query += "and _parentPath = '/content" + parent._path + "'";
    }
  }
  if (filters.additionalQuery) {
    query += filters.additionalQuery;
  }
  return contentLib.query<Block | Game | Location>({
    query: query,
    start: 0,
    count: filters.count ? filters.count : -1,
    sort: filters.sort ? filters.sort : "_score DESC"
  }).hits;
}

interface Filters {
  type: string;
  master?: string;
  location?: string;
  parentId?: string;
  parentPathLike?: boolean;
  parent?: Content;
  additionalQuery?: string;
  count?: number;
  sort?: string;
}
