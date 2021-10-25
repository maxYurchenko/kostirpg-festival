import { Content } from "enonic-types/content";
import { getFestivals } from "./getFestivals";
const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

export { getFestivalByChild };

function getFestivalByChild(id: string) {
  let parent: any = checkParent(id);
  parent.online = parent && parent.onlineFestival;
  return parent;
}

function checkParent(id: string): Content {
  let parent = utils.content.getParent({ key: id });
  if (parent.type === app.name + ":landing") {
    return parent;
  } else {
    return checkParent(parent._id);
  }
}
